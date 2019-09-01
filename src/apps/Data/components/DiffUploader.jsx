import React from 'react';
import { connect } from 'react-redux';
import { setEditorData } from '../../../redux/actions/Data/dataActions';
import * as deep_diff from 'deep-diff';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { firebaseGithubAuth } from '../../../common/firebase/firebaseApp';
import octokitCreatePullRequest from '../scripts/pull';
import * as protobuf from 'protobufjs';
import getLatestSchema, {
  getNextSchemaName
} from '../../Graph/libraries/SGLib/utils/getLatestSchema';
import { blobToBase64 } from 'base64-blob';

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: 10
  }
}));

const resolveType = kind => {
  switch (kind) {
    case 'D':
      return 'Deleted';
    case 'A':
      return 'Added';
    case 'E':
      return 'Changed';
    default:
      return kind;
  }
};

const Octokit = require('@octokit/rest').plugin(octokitCreatePullRequest);

// function saveAs(blob, fileName) {
//   const url = window.URL.createObjectURL(blob);
//
//   const anchorElem = document.createElement('a');
//   // anchorElem.style = "display: none";
//   anchorElem.href = url;
//   anchorElem.download = fileName;
//
//   document.body.appendChild(anchorElem);
//   anchorElem.click();
//   document.body.removeChild(anchorElem);
//
//   // On Edge, revokeObjectURL should be called only after
//   // a.click() has completed, atleast on EdgeHTML 15.15048
//   setTimeout(function() {
//     window.URL.revokeObjectURL(url);
//   }, 1000);
// }

function DiffUploader(props) {
  // console.error(props);
  const classes = useStyles();

  function loginWithGithub() {
    return firebaseGithubAuth().then(function(result) {
      // console.error(result.user, result.credential.accessToken);
      // setLoginToken(result.credential.accessToken);
      const client = new Octokit({
        auth: result.credential.accessToken
      });
      // setOctoClient(client);

      return client;
    });
  }

  // Declare a new state variable, which we'll call "count"
  var lhs = {
    name: 'my object',
    description: "it's an object!",
    details: {
      poo: '1',
      it: 'has',
      an: 'array',
      with: ['a', 'few', 'elements']
    }
  };

  var rhs = {
    name: 'updated object',
    description: "it's an object!",
    details: {
      it: 'has',
      an: 'array',
      with: ['a', 'few', 'more', 'elements', { than: 'before' }]
    }
  };

  var differences = deep_diff.diff(lhs, rhs);

  const enums = ['MachineClass', 'Item', 'UpgradeTiers', 'Recipe'];
  const data = ['RecipeList', 'MachineClassList'];

  const diffables = [...enums, ...data];

  const diffs = {};

  diffables.forEach(diff => {
    const diff_old = diff + 'Original';
    if (
      props[diff_old] &&
      props[diff] &&
      props[diff_old].rows.length > 0 &&
      props[diff].rows.length > 0
    ) {
      const differences = deep_diff.diff(
        props[diff_old].rows,
        props[diff].rows
      );
      if (differences) {
        diffs[diff] = differences;
      }
    }
  });

  const globalDict = {};

  const presentableData = {};

  const fullEnumFiles = enums.map(e => {
    const internalDict = {};
    if (!props[e]) return null;
    props[e].rows.forEach(row => {
      internalDict[row.enum] = row.id;
    });
    const individual = {
      nested: {
        satisgraphtory: {
          nested: {
            [e]: {
              values: internalDict
            }
          }
        }
      }
    };

    globalDict[e] = { values: internalDict };
    presentableData['src/proto/' + e + '.json'] = new Blob(
      [JSON.stringify(individual, null, 2)],
      { type: 'text/plain' }
    );
    return individual;
  });

  const innerData = data
    .map(item => props[item] && props[item].rows)
    .every(item => item);

  let errorArray = [];

  if (fullEnumFiles.filter(item => item === null).length === 0 && innerData) {
    const schema = getLatestSchema();
    const innerSchema = schema.nested.satisgraphtory.nested;
    const blacklistedTables = new Set(enums);
    Object.keys(innerSchema).forEach(key => {
      if (!blacklistedTables.has(key)) {
        globalDict[key] = innerSchema[key];
      }
    });

    // it's done!
    const finalReflection = {
      nested: { satisgraphtory: { nested: globalDict } }
    };

    console.log('Final', finalReflection);
    const root = protobuf.Root.fromJSON(finalReflection);

    const recipeCollector = data => {
      const result = {};
      data.forEach(row => {
        if (row.parentId === null) {
          result[row.id] = { ...row };
        }
      });
      data.forEach(row => {
        if (row.parentId !== null) {
          const dataRow = result[row.parentId];
          if (row.itemType === 'input') {
            dataRow.input = dataRow.input || [];
            dataRow.input.push({ item: row.item, itemQuantity: row.qty });
          } else if (row.itemType === 'output') {
            dataRow.output = dataRow.output || [];
            dataRow.output.push({ item: row.item, itemQuantity: row.qty });
          } else {
            throw Error('Invalid subType' + JSON.stringify(row));
          }
        }
      });

      return Object.values(result);
    };

    const errors = [];

    const compressedData = data.map(dataName => {
      const dataType = root.lookupType(dataName);
      let data = props[dataName].rows;
      if (dataName === 'RecipeList') {
        data = recipeCollector(data);

        data = data.map(item => {
          const Recipe = root.lookupEnum('Recipe');
          if (Recipe.values[item.id] === undefined) {
            errors.push('No enum mapping for ' + item.id + ' in Recipe');
          }
          return { ...item, id: Recipe.values[item.id] };
        });
      } else if (dataName === 'MachineClassList') {
        data = data.map(item => {
          const MachineClass = root.lookupEnum('MachineClass');
          if (MachineClass.values[item.id] === undefined) {
            errors.push('No enum mapping for ' + item.id + ' in Recipe');
          }
          return { ...item, id: MachineClass.values[item.id] };
        });
      }

      if (errors.length > 0) {
        return { errors };
      }

      const verify = dataType.verify(data);

      if (verify) {
        console.log(verify);
        throw new Error('Not verified!');
      } else {
        console.log(dataName + ' schema verified');
      }

      console.log(data);
      const buffer = dataType.encode({ data }).finish();

      // saveAs(new Blob([buffer], { type: 'application/octet-stream' }), dataName + '.s2');

      return {
        name: 'public/proto/' + getNextSchemaName() + '/' + dataName + '.s2',
        data: new Blob([buffer], { type: 'application/octet-stream' })
      };
    });

    compressedData.forEach(data => {
      if (data.errors) {
        errorArray.push(...data.errors);
      } else {
        presentableData[data.name] = data.data;
      }
    });
  }

  const primeData = rawFiles => {
    return () =>
      loginWithGithub().then(client => {
        const files = {};
        const promises = [];
        Object.keys(rawFiles).forEach(item => {
          let promise = blobToBase64(rawFiles[item]);
          promises.push(promise);
          promise.then(data => {
            files[item] = data;
          });
        });

        Promise.all(promises).then(() => {
          console.log('Creating Pull Request...');
          client
            .createPullRequest({
              owner: 'rhocode',
              repo: 'Giraffe',
              title: 'Bump data to' + getNextSchemaName(),
              body: `This pull request adds {put data here} data and bumps the version.`,
              head: getNextSchemaName() + Math.floor(Math.random() * 10),
              changes: {
                files,
                commit: 'Bump all data files to' + getNextSchemaName()
              }
            })
            .then(pr => console.log('Pull request created: ' + pr.data.number));
        });
      });
  };

  const buttonFunc = primeData(presentableData);

  return (
    <div className={classes.card}>
      <Button disabled={errorArray.length > 0} onClick={() => buttonFunc()}>
        Push to Github
      </Button>
      {
        <Card className={classes.card}>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Errors:
            </Typography>
            <Typography variant="body2" component="p">
              {errorArray.map(item => {
                return (
                  <>
                    {item}
                    <br />
                  </>
                );
              })}
            </Typography>
          </CardContent>
        </Card>
      }
      {differences.map((diff, index) => {
        return (
          <Card key={index} className={classes.card}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {`${resolveType(diff.kind)}: ${diff.path.join(' / ')}`}
              </Typography>
              <Typography variant="body2" component="p">
                {switchContent(diff)}
              </Typography>
            </CardContent>
            {/*<CardActions>*/}
            {/*  <Button size="small">Learn More</Button>*/}
            {/*</CardActions>*/}
          </Card>
        );
      })}
    </div>
  );
}

const switchContent = diff => {
  switch (diff.kind) {
    case 'D':
      return 'Deleted';
    case 'A':
      return 'Added';
    case 'E':
      return 'Changed';
    default:
      return diff.kind;
  }
};

const mapStateToProps = state => ({
  MachineClass: state.dataReducer['MachineClass'],
  MachineClassOriginal: state.dataReducer['MachineClass_original'],
  Item: state.dataReducer['Item'],
  ItemOriginal: state.dataReducer['Item_original'],
  Recipe: state.dataReducer['Recipe'],
  RecipeOriginal: state.dataReducer['Recipe_original'],
  RecipeList: state.dataReducer['RecipeList'],
  RecipeListOriginal: state.dataReducer['RecipeList_original'],
  MachineClassList: state.dataReducer['MachineClassList'],
  MachineClassListOriginal: state.dataReducer['MachineClassList_original'],
  UpgradeTiers: state.dataReducer['UpgradeTiers'],
  UpgradeTiersOriginal: state.dataReducer['UpgradeTiers_original']
});

const mapDispatchToProps = dispatch => ({
  setData: data => dispatch(setEditorData(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiffUploader);
