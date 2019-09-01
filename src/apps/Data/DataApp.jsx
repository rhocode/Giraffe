import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setEditorData } from '../../redux/actions/Data/dataActions';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import EnumEditor from './components/EnumEditor';
import PageCloseHandler from './PageCloseHandler';
import NestedEditor from './components/NestedEditor';
import {
  machineInstanceListPromise,
  recipeListPromise
} from '../../graphql/resolvers';
import FlatEditor from './components/FlatEditor';
import DiffUploader from './components/DiffUploader';

const machineClassMapper = raw => {
  return Object.values(raw);
};

const recipeClassMapper = raw => {
  const data = Object.values(raw);
  const rootRows = [];
  data.forEach(row => {
    const thisRow = {
      alt: row.alt || false,
      hidden: row.hidden || false,
      id: row.id,
      machineClass: row.machineClass,
      name: row.name,
      time: row.time,
      internalId: 0,
      parentId: null
    };

    let idCounter = 1;

    const leafRowsInput = row.input
      ? row.input.map(entry => {
          return {
            parentId: row.id,
            item: entry.item,
            qty: entry.itemQuantity,
            internalId: idCounter++,
            itemType: 'input',
            parentPointer: thisRow
          };
        })
      : [];
    const leafRowsOutput = row.output
      ? row.output.map(entry => {
          return {
            parentId: row.id,
            item: entry.item,
            qty: entry.itemQuantity,
            internalId: idCounter++,
            itemType: 'output',
            parentPointer: thisRow
          };
        })
      : [];

    rootRows.push(thisRow);
    rootRows.push(...leafRowsInput, ...leafRowsOutput);
  });

  return rootRows;
};

const enums = ['UpgradeTiers', 'Item', 'MachineClass', 'Recipe'];
const dataLists = [
  { name: 'RecipeList', mapper: recipeClassMapper, data: recipeListPromise },
  {
    name: 'MachineClassList',
    mapper: machineClassMapper,
    data: machineInstanceListPromise
  }
];

const importEnumJSON = enm => {
  const data = require('../../proto/' + enm + '.json');
  const enums = data.nested.satisgraphtory.nested[enm].values;
  const reserved = data.nested.satisgraphtory.nested[enm].reserved;

  return {
    enums,
    reserved
  };
};

function TabPanel(props) {
  const { children, ...other } = props;

  return (
    <Box {...other} p={3}>
      {children}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    width: '100%',
    color: theme.palette.primary.main,
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: 'auto',
    gridTemplateAreas: `'sidebar main'`
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    gridArea: 'sidebar'
  },
  tab: {
    gridArea: 'main'
    // display: 'grid',
    // gridTemplateColumns: '1fr',
    // gridTemplateRows: '1fr',
    // gridTemplateAreas: `'datagrid'`
  }
}));

function DataApp(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    enums.forEach(enm => {
      const imported = importEnumJSON(enm);

      const usedData = [];

      Object.keys(imported.enums).forEach(key => {
        usedData.push({ enum: key, id: imported.enums[key] });
      });

      props.setData({
        dataName: enm,
        data: {
          reserved: imported.reserved || [],
          rows: usedData
        }
      });
    });

    dataLists.forEach(promise => {
      promise.data.then(data => {
        const mappedData = promise.mapper(data);
        props.setData({
          dataName: promise.name,
          data: {
            rows: mappedData.slice(0, 20)
          }
        });
      });
    });
  }, [props]);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <PageCloseHandler />
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Data Editor"
        className={classes.tabs}
      >
        <Tab label="Item (Enum)" {...a11yProps(0)} />
        <Tab label="Recipe (Enum)" {...a11yProps(1)} />
        <Tab label="Upgrades (Enum)" {...a11yProps(2)} />
        <Tab label="MachineClass (Enum)" {...a11yProps(3)} />
        <Tab label="Recipe List" {...a11yProps(4)} />
        <Tab label="Machine Class List" {...a11yProps(5)} />
        <Tab label="Data Diff" {...a11yProps(6)} />
      </Tabs>
      {value === 0 ? (
        <TabPanel className={classes.tab}>
          <EnumEditor objectName={'Item'} />
        </TabPanel>
      ) : null}
      {value === 1 ? (
        <TabPanel className={classes.tab}>
          <EnumEditor objectName={'Recipe'} />
        </TabPanel>
      ) : null}
      {value === 2 ? (
        <TabPanel className={classes.tab}>
          <EnumEditor objectName={'UpgradeTiers'} />
        </TabPanel>
      ) : null}
      {value === 3 ? (
        <TabPanel className={classes.tab}>
          <EnumEditor objectName={'MachineClass'} />
        </TabPanel>
      ) : null}
      {value === 4 ? (
        <TabPanel className={classes.tab}>
          <NestedEditor objectName={'RecipeList'} />
        </TabPanel>
      ) : null}
      {value === 5 ? (
        <TabPanel className={classes.tab}>
          <FlatEditor objectName={'MachineClassList'} />
        </TabPanel>
      ) : null}
      {value === 6 ? (
        <TabPanel className={classes.tab}>
          <DiffUploader />
        </TabPanel>
      ) : null}
    </div>
  );
}

// class DataApp extends Component {
//
//   componentDidMount() {
//     // const schema = getLatestSchema();
//     // serialize(schema, {});
//
//     enums.forEach(enm => {
//       this.props.setData({
//         dataName: enm,
//         data: importEnumJSON(enm)
//       })
//     });
//   }
//
//   render() {
//     const { classes } = this.props;
//
//     return (
//       <div className={classes.container}>
//         {/*<pre>{JSON.stringify(this.state.data, null, 4)}</pre>*/}
//       </div>
//     );
//   }
// }

const mapStateToProps = state => ({
  // Item: state.dataReducer.Item,
  // MachineClass: state.dataReducer.MachineClass,
  // Recipe: state.dataReducer.Recipe
});

const mapDispatchToProps = dispatch => ({
  setData: data => dispatch(setEditorData(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataApp);
