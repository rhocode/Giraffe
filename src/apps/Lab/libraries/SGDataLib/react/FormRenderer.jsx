import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import TextField from '@material-ui/core/TextField';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import {
  addLocalChange,
  addTableRow,
  removeAllLocalChangesForTableRow,
  removeLocalChange
} from '../../../../../redux/actions/Lab/labActions';
import { unpackComplexObject } from '../datatypes/internal/FirebaseDataType';
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import SelectDropdown from '../../../../../common/react/SelectDropdown';

const styles = theme => ({
  card: {
    minWidth: 500,
    maxWidth: 500,
    margin: 10,
    alignSelf: 'flex-start'
  },
  cardContent: {
    paddingTop: 0,
    paddingBottom: 0
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  unwrittenEntry: {
    backgroundColor: red[500]
  },
  writtenEntry: {
    backgroundColor: green[500]
  },
  textField: {
    margin: 3,
    flex: 1
  },
  resetButton: {
    flex: 0
  },
  entryDiv: {
    display: 'flex',
    alignItems: 'center'
  },
  buttonSpacer: {
    flex: 0,
    visibility: 'hidden'
  }
});

function generateCard(classes, context, renderedItem, expanded) {
  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          this.hasLocalEdits(context) ? (
            <Avatar className={classes.unwrittenEntry}>
              <EditIcon />
            </Avatar>
          ) : (
            <Avatar aria-label="Recipe" className={classes.writtenEntry}>
              <CheckIcon />
            </Avatar>
          )
        }
        action={
          <IconButton
            size="small"
            onClick={this.props.openDeletion(
              this.deleteRow(context),
              context.object
            )}
          >
            <DeleteIcon />
          </IconButton>
        }
        title={renderedItem.getFirebaseId()}
        subheader={renderedItem.getFirebaseRefPath()}
      />
      <CardContent className={classes.cardContent}>
        {this.generateForm(renderedItem, classes)}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="Upload to Cloud"
          disabled={!this.hasLocalEdits(context)}
          onClick={this.writeALlEdits(context)}
        >
          <CloudUploadIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={this.handleExpandClick}
          aria-expanded={expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <div>{JSON.stringify(this.props.localChanges)}</div>
        </CardContent>
      </Collapse>
    </Card>
  );
}

class FormRenderer extends Component {
  state = {
    expanded: false
  };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  handleInputChange = context => {
    return evt => {
      this.props.addLocalChange(
        Object.assign({}, context, { value: evt.target.value })
      );
    };
  };

  deleteInputBoxContents = context => {
    this.props.addLocalChange(Object.assign({}, context, { value: null }));
  };

  resetInputBox = context => {
    return evt => {
      this.props.removeLocalChange(context);
    };
  };

  hasLocalEdits = (context, checkField = false) => {
    const local = this.props.localChanges;
    if (checkField) {
      const { key } = context;

      return !!(local && local[key] !== undefined);
    } else {
      return !!(local && Object.keys(local).length);
    }
  };

  componentDidUpdate() {
    const local = this.props.localChanges;
    const { renderedItem, table } = this.props;
    const object = renderedItem.getFirebaseId();

    if (local) {
      const isSame = Object.keys(local)
        .map(key => {
          return (
            renderedItem[key] === local[key] ||
            ((renderedItem[key] === null || renderedItem[key] === undefined) &&
              local[key] === '')
          );
        })
        .every(key => !!key);
      if (isSame) {
        this.props.removeAllLocalChangesForTableRow({ table, object });
      }
    }
  }

  getLocalEdits = context => {
    const { key, serverValue } = context;
    const local = this.props.localChanges;
    if (this.hasLocalEdits(context, true)) {
      return local[key] || '';
    }

    return serverValue || '';
  };

  writeALlEdits = context => {
    if (!this.hasLocalEdits(context)) {
      return;
    }

    const { data } = context;
    const local = this.props.localChanges;

    return () => {
      Object.keys(local).forEach(key => {
        data[key] = local[key];
      });

      data.write().then(() => {
        this.props.removeAllLocalChangesForTableRow(context);
      });
    };
  };

  deleteRow = context => {
    const { data } = context;

    return () => {
      data.delete().then(() => {
        this.props.removeAllLocalChangesForTableRow(context);
      });
    };
  };

  generateComplexForm = (key, classes) => {
    const thisAccessor = this;

    const dataMapping = key.generatedDataMapping();

    const formattedData = {};
    const formMetadata = {};

    const relevantLocalChanges = this.props.localChanges || {};

    key
      .generatedDataMappingComplexKeys(relevantLocalChanges)
      .forEach(dataKey => {
        const [fieldName, rowString, keyName] = unpackComplexObject(dataKey);

        const row = parseInt(rowString);

        const context = {
          table: thisAccessor.props.table,
          object: key.getFirebaseId(),
          key: dataKey,
          serverValue: key.getServerValue(dataKey),
          data: key
        };

        let extraProps = {
          autoComplete: 'false',
          spellCheck: 'false'
        };

        extraProps = Object.assign(extraProps, {
          ...dataMapping[dataKey]
        });

        // if ((dataMapping[repackComplexObject([fieldName, padIndex(0), keyName])] || {}).type === 'number') {
        //   extraProps = Object.assign(extraProps, {
        //     ...dataMapping[dataKey],
        //     type: 'number',
        //   });
        // }

        formattedData[fieldName] = formattedData[fieldName] || [];
        formMetadata[fieldName] = formMetadata[fieldName] || {};
        while (row >= formattedData[fieldName].length) {
          formattedData[fieldName].push({});
        }

        formattedData[fieldName][row][keyName] = context;
        formMetadata[fieldName][keyName] = extraProps;
      });

    let i = 0;

    return Object.keys(formattedData).map(formattedKey => {
      return formattedData[formattedKey].map((row, index) => {
        const keys = Object.keys(row);

        const localContext = {
          table: thisAccessor.props.table,
          object: key.getFirebaseId(),
          key: formattedKey,
          data: key
        };

        const elementList = [];

        const localContexts = [];

        keys.forEach(innerKey => {
          const fieldMetadata = formMetadata[formattedKey][innerKey];
          const context = row[innerKey];
          const internalKey = context.key;
          localContexts.push(context);

          let autocompleteList = [];
          let useSelect = false;

          if (fieldMetadata.type === 'boolean') {
            useSelect = true;
            autocompleteList = [
              { label: 'false', value: 'false' },
              { label: 'true', value: 'true' }
            ];
          }

          if (fieldMetadata.ref !== undefined) {
            useSelect = true;
            const ref = fieldMetadata.ref;
            const identifier = fieldMetadata.refIdentifier || 'identifier';
            const dataList = thisAccessor.props.autoCompleteData[ref] || [];
            if (identifier === 'identifier') {
              // Use the ID
              autocompleteList = [
                { label: 'Unset', value: '' },
                ...dataList.map(item => {
                  return { value: item.id, label: item.id };
                })
              ];
            } else {
              autocompleteList = [
                { label: 'Unset', value: '' },
                ...dataList.map(item => {
                  return {
                    value: item.data[identifier],
                    label: item.data[identifier]
                  };
                })
              ];
            }
          }

          elementList.push(
            <React.Fragment key={internalKey}>
              {useSelect ? (
                <SelectDropdown
                  onChange={this.handleInputChange(context)}
                  classProp={classes.textField}
                  value={this.getLocalEdits(context)}
                  label={`${formattedKey}-${innerKey}`}
                  helperText={`Server: ${
                    context.serverValue ? context.serverValue : 'null'
                  }`}
                  suggestions={autocompleteList}
                />
              ) : (
                <TextField
                  id={`input-${internalKey}`}
                  label={`${formattedKey}-${innerKey}`}
                  className={classes.textField}
                  value={this.getLocalEdits(context)}
                  onChange={this.handleInputChange(context)}
                  margin="normal"
                  helperText={`Server: ${
                    context.serverValue ? context.serverValue : 'null'
                  }`}
                  inputProps={fieldMetadata}
                />
              )}
              <IconButton
                size="small"
                className={classes.resetButton}
                aria-label="Refresh"
                onClick={this.resetInputBox(context)}
              >
                <RefreshIcon />
              </IconButton>
            </React.Fragment>
          );
        });

        if (index + 1 === formattedData[formattedKey].length) {
          elementList.push(
            <IconButton
              size="small"
              key={'uniqueIconButton' + formattedKey}
              className={classes.resetButton}
              aria-label="Refresh"
              onClick={() => thisAccessor.props.addTableRow(localContext)}
            >
              <AddIcon />
            </IconButton>
          );
        } else {
          elementList.push(
            <IconButton
              size="small"
              key={'uniqueIconButtonDelete' + formattedKey}
              className={classes.resetButton}
              onClick={() =>
                localContexts.forEach(context => {
                  thisAccessor.deleteInputBoxContents(context);
                })
              }
            >
              <DeleteIcon />
            </IconButton>
          );
        }

        return (
          <div key={formattedKey + i++} className={classes.entryDiv}>
            {elementList}
          </div>
        );
      });
    });
  };

  generateForm = (key, classes) => {
    const thisAccessor = this;

    const dataMapping = key.generatedDataMapping();
    return [
      ...key
        .generatedDataMappingNormalKeys()
        .map(dataKey =>
          this.generateSimpleForm(
            thisAccessor,
            key,
            dataKey,
            dataMapping,
            classes
          )
        ),
      ...this.generateComplexForm(key, classes)
    ];
  };

  generateSimpleForm(thisAccessor, key, dataKey, dataMapping, classes) {
    const context = {
      table: thisAccessor.props.table,
      object: key.getFirebaseId(),
      key: dataKey,
      serverValue: key[dataKey],
      data: key
    };

    let extraProps = {
      autoComplete: 'false',
      spellCheck: 'false'
    };

    if (dataMapping[dataKey].type === 'number') {
      extraProps = Object.assign(extraProps, {
        ...dataMapping[dataKey],
        type: 'number'
      });
    }

    let autocompleteList = [];

    let useSelect = false;

    if (dataMapping[dataKey].type === 'boolean') {
      useSelect = true;
      autocompleteList = [
        { label: 'false', value: 'false' },
        { label: 'true', value: 'true' }
      ];
    }

    if (dataMapping[dataKey].ref !== undefined) {
      useSelect = true;
      const ref = dataMapping[dataKey].ref;
      const identifier = dataMapping[dataKey].refIdentifier || 'identifier';
      const dataList = thisAccessor.props.autoCompleteData[ref] || [];
      if (identifier === 'identifier') {
        // Use the ID
        autocompleteList = [
          { label: 'Unset', value: '' },
          ...dataList.map(item => {
            return { value: item.id, label: item.id };
          })
        ];
      } else {
        autocompleteList = [
          { label: 'Unset', value: '' },
          ...dataList.map(item => {
            return {
              value: item.data[identifier],
              label: item.data[identifier]
            };
          })
        ];
      }
    }

    const isLockedIdentifier =
      dataKey === 'identifier' && key.useIdentifierAsDocumentName();

    const inputType = useSelect ? (
      <SelectDropdown
        onChange={this.handleInputChange(context)}
        classProp={classes.textField}
        value={this.getLocalEdits(context) + ''}
        label={dataKey}
        helperText={`Server: ${key[dataKey] ? key[dataKey] : 'null'}`}
        suggestions={autocompleteList}
      />
    ) : (
      <TextField
        id={`input-${dataKey}`}
        label={dataKey}
        className={classes.textField}
        value={this.getLocalEdits(context)}
        onChange={this.handleInputChange(context)}
        margin="normal"
        helperText={`Server: ${key[dataKey] ? key[dataKey] : 'null'}`}
        inputProps={extraProps}
      />
    );

    return isLockedIdentifier ? null : (
      <div key={dataKey} className={classes.entryDiv}>
        {inputType}
        <IconButton
          size="small"
          className={classes.resetButton}
          aria-label="Refresh"
          onClick={this.resetInputBox(context)}
        >
          <RefreshIcon />
        </IconButton>
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      this.state.expanded !== nextState.expanded ||
      this.props.localChanges !== nextProps.localChanges
    );
  }

  render() {
    const { classes, renderedItem } = this.props;
    const { expanded } = this.state;

    const context = {
      table: this.props.table,
      object: renderedItem.getFirebaseId(),
      data: renderedItem
    };

    return generateCard.call(this, classes, context, renderedItem, expanded);
  }
}

// function FunctionalForm(props) {
//   const [expanded, setExpanded] = React.useState(false);
//   const localChanges = props.reduxTable ? props.reduxTable[props.renderedItem.getFirebaseId()] : null;
// }

function mapStateToProps(state, ownProps) {
  const { renderedItem, table } = ownProps;
  return {
    localChanges: (state.labReducer.localChanges[table] || {})[
      renderedItem.getFirebaseId()
    ]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addLocalChange: data => dispatch(addLocalChange(data)),
    removeLocalChange: data => dispatch(removeLocalChange(data)),
    removeAllLocalChangesForTableRow: data =>
      dispatch(removeAllLocalChangesForTableRow(data)),
    addTableRow: data => dispatch(addTableRow(data))
  };
}

export default withLocalize(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(FormRenderer))
);
