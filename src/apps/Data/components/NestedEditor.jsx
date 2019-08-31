import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core';

import {
  Grid,
  Table,
  TableEditColumn,
  TableEditRow,
  TableHeaderRow,
  TableTreeColumn
} from '@devexpress/dx-react-grid-material-ui';
import {
  CustomTreeData,
  DataTypeProvider,
  EditingState,
  TreeDataState
} from '@devexpress/dx-react-grid';
import { setEditorData } from '../../../redux/actions/Data/dataActions';
import * as protobuf from 'protobufjs/light';
import getLatestSchema from '../../Graph/libraries/SGLib/utils/getLatestSchema';
import TableCell from '@material-ui/core/TableCell';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const styles = theme => {
  return {
    dataGrid: {
      // gridArea: 'gridarea',
      // justifySelf: 'start'
    }
  };
};

const getRowId = row => (row.id || row.parentId) + '_' + row.internalId;

const ActionButton = props => {
  return <TableEditColumn.Command {...props} />;
};

const root = protobuf.Root.fromJSON(getLatestSchema());

const MachineClassFormatter = ({ value }) => {
  return MachineClass.valuesById[value] || '';
};

const MachineClassProvider = props => (
  <DataTypeProvider formatterComponent={MachineClassFormatter} {...props} />
);

const ItemFormatter = ({ value }) => {
  return Item.valuesById[value] || '';
};

const ItemProvider = props => (
  <DataTypeProvider formatterComponent={ItemFormatter} {...props} />
);

const MachineClass = root.lookupEnum('MachineClass');
const Item = root.lookupEnum('Item');

const machineClassEnumToString = {};

Object.keys(MachineClass.values).map(key => {
  const enm = MachineClass.values[key];
  machineClassEnumToString[enm] = key;
});

const itemEnumToString = {};

Object.keys(Item.values).map(key => {
  const enm = Item.values[key];
  itemEnumToString[enm] = key;
});

const columnLookup = {
  machineClass: machineClassEnumToString,
  item: itemEnumToString,
  itemType: { input: 'input', output: 'output' }
};

const useStyles = makeStyles(theme => ({
  lookupEditCell: {
    paddingLeft: 8,
    paddingRight: 8
  },
  selectBox: {
    width: '100%'
  },
  filterTop: {
    marginTop: 0
  }
}));

const EditCell = props => {
  const classes = useStyles();

  const lookup = columnLookup[props.column.name];

  const [value, setValue] = React.useState(
    props.value === undefined ? '' : props.value
  );

  const [searchValue, setSearchValue] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  function handleChange(event) {
    console.error('!!NJ@KNKJENKDK', event.target.value);
    const newValue = event.target.value;

    if (newValue !== INVALID_KEY_ITEM) {
      setSearchOpen(false);
      setValue(newValue);
      props.onValueChange(newValue);
    }
  }

  React.useEffect(() => {
    const data = props.row.parentPointer
      ? props.row.parentPointer[props.column.name]
      : undefined;
    if (data !== undefined) {
      if (data !== value) {
        setValue(data);
      }
    }
  }, [props.row.parentPointer]);

  let newProps = {};

  const parentEditableSet = new Set(['id', 'machineClass', 'time']);

  let disableDropdown = false;

  let useParentValue = false;

  if (props.row.parentId !== null) {
    const parentRow = props.row.parentPointer;

    if (parentRow) {
      if (parentEditableSet.has(props.column.name)) {
        newProps.value =
          parentRow[props.column.name] === undefined
            ? ''
            : parentRow[props.column.name];
        newProps.editingEnabled = false;
        disableDropdown = true;
        useParentValue = true;
      }
    } else {
      if (parentEditableSet.has(props.column.name)) {
        newProps.value = '(disabled)';
        newProps.editingEnabled = false;
        disableDropdown = true;
      }
    }
  } else {
    if (!parentEditableSet.has(props.column.name)) {
      newProps.value = '';
      newProps.editingEnabled = false;
      disableDropdown = true;
    }
  }

  const INVALID_KEY_ITEM = 'INVALID_KEY_ITEM';
  const ITEM_INPUT_ID = 'ITEM_INPUT_ID';

  if (lookup !== undefined) {
    const usedValue = useParentValue ? newProps.value : value;
    return (
      <TableCell className={classes.lookupEditCell}>
        <Select
          className={classes.selectBox}
          value={usedValue}
          onChange={handleChange}
          open={searchOpen}
          onOpen={() => {
            setSearchOpen(true);
          }}
          onClose={evt => {
            console.error('HUH WHAT', evt.target.id);
            if (evt.target && evt.target.id !== ITEM_INPUT_ID) {
              console.error('RAM??');
              setSearchOpen(false);
            }
            // noop
          }}
          disabled={disableDropdown}
          MenuProps={{
            disableAutoFocusItem: true
          }}
        >
          <MenuItem key={INVALID_KEY_ITEM} value={INVALID_KEY_ITEM}>
            <TextField
              id={ITEM_INPUT_ID}
              label="Filter"
              className={classes.filterTop}
              value={searchValue}
              onChange={event => setSearchValue(event.target.value)}
              margin="normal"
              fullWidth
            />
          </MenuItem>
          {Object.keys(lookup).map(key => {
            const value = lookup[key];
            return (
              <MenuItem key={key + '_' + value} value={key}>
                {value}
              </MenuItem>
            );
          })}
        </Select>
      </TableCell>
    );
  }

  return <TableEditRow.Cell {...props} {...newProps} />;
};

const Control = props => (
  <TextField
    fullWidth
    InputProps={{
      inputProps: {
        className: props.selectProps.classes.input,
        inputRef: props.innerRef,
        children: props.children,
        ...props.innerProps
      }
    }}
    {...props.selectProps.textFieldProps}
  />
);

const CommandCell = props => (
  <TableEditColumn.Cell {...props}>
    {React.Children.toArray(props.children).map(child => {
      if (
        child.props.id === 'delete' &&
        (!props.tableRow.row.local && props.tableRow.row.parentId === undefined)
      ) {
        const newProps = Object.assign({}, child.props, { disabled: true });
        return Object.assign({}, child, { props: newProps });
      } else {
        return child;
      }
    })}
  </TableEditColumn.Cell>
);

function removeChars(validChars, inputString) {
  var regex = new RegExp('[^' + validChars + ']', 'g');
  return inputString.replace(regex, '');
}

const getChildRows = (row, rootRows) => {
  const childRows = rootRows.filter(r => r.parentId === (row ? row.id : null));
  return childRows.length ? childRows : null;
};

// https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/data-formatting/

function NestedEditor(props) {
  // Declare a new state variable, which we'll call "count"
  const [columns] = useState([
    { name: 'id', title: 'ID' },
    { name: 'machineClass', title: 'MachineClass' },
    { name: 'time', title: 'Processing Time (sec)' },
    { name: 'itemType', title: 'Resource Type' },
    { name: 'item', title: 'Item' },
    { name: 'qty', title: 'Item Quantity' }
  ]);

  const rows = props.data ? props.data.rows : [];
  const rowSet = new Set(rows.filter(row => row.id).map(row => row.id));
  const [tableColumnExtensions] = useState([{ columnName: 'id', width: 450 }]);

  const commitChanges = ({ added, changed, deleted }) => {
    let changedRows;

    if (added) {
      const addedRows = [];

      added
        .filter(row => row.id)
        .map((row, index) => {
          const modified = {};

          let maxInternalId =
            Math.max(
              ...rows
                .filter(row => row.parentId === row.id)
                .map(row => row.internalId),
              0
            ) + 1;

          if (rowSet.has(row.id)) {
            modified.id = null;
            modified.parentId = row.id;
          }

          const toAdd = [];

          if (modified.parentId) {
            const parentRow = rows.filter(
              row => row.id === modified.parentId
            )[0];
            if (row.item && row.qty && row.itemType === 'input') {
              const inputObj = Object.assign({}, modified, {
                item: row.item,
                qty: row.qty,
                internalId: maxInternalId++,
                itemType: 'input',
                parentPointer: parentRow
              });
              toAdd.push(inputObj);
            }
            if (row.item && row.qty && row.itemType === 'output') {
              const outputObj = Object.assign({}, modified, {
                item: row.item,
                qty: row.qty,
                internalId: maxInternalId++,
                itemType: 'output',
                parentPointer: parentRow
              });
              toAdd.push(outputObj);
            }
          } else {
            const modified = {};
            modified.internalId = 0;

            const newParentRow = {
              ...row,
              ...modified
            };

            toAdd.push(newParentRow);

            if (row.item && row.qty && row.itemType === 'input') {
              const inputObj = Object.assign({}, modified, {
                id: null,
                parentId: row.id,
                item: row.item,
                qty: row.qty,
                internalId: maxInternalId++,
                itemType: 'input',
                parentPointer: newParentRow
              });
              toAdd.push(inputObj);
            }
            if (row.item && row.qty && row.itemType === 'output') {
              const outputObj = Object.assign({}, modified, {
                id: null,
                parentId: row.id,
                item: row.item,
                qty: row.qty,
                internalId: maxInternalId++,
                itemType: 'output',
                parentPointer: newParentRow
              });
              toAdd.push(outputObj);
            }
          }

          addedRows.push(...toAdd);
        });

      changedRows = [...rows, ...addedRows];
    }
    if (changed) {
      const newParentMapping = new Map();
      const changedIntermediate = [];

      rows.forEach(row => {
        let setMapping = false;
        if (changed[getRowId(row)] && row.parentId === null) {
          setMapping = true;
        }

        if (changed[getRowId(row)]) {
          const newRow = { ...row, ...changed[getRowId(row)] };
          if (setMapping) {
            newParentMapping.set(row.id, newRow);
          }

          changedIntermediate.push(newRow);
          return;
        }

        changedIntermediate.push(row);
      });

      changedRows = changedIntermediate.map(row => {
        if (newParentMapping.get(row.parentId)) {
          return {
            ...row,
            parentPointer: newParentMapping.get(row.parentId),
            parentId: newParentMapping.get(row.parentId).id
          };
        }

        return row;
      });
    }

    if (deleted) {
      const deletedSet = new Set(deleted);
      const deletedRows = rows
        .filter(row => deletedSet.has(getRowId(row)))
        .filter(item => item.parentId === null);
      const deletedSoloRows = rows.filter(row => deletedSet.has(getRowId(row)));
      const deletedRowIds = new Set(deletedRows.map(item => item.id));
      const deletedChildren = rows.filter(row => {
        return deletedRowIds.has(row.parentId);
      });

      const allDeleted = new Set([
        ...deletedRows.map(item => getRowId(item)),
        ...deletedSoloRows.map(item => getRowId(item)),
        ...deletedChildren.map(item => getRowId(item))
      ]);

      changedRows = rows.filter(row => !allDeleted.has(getRowId(row)));
    }

    const newDict = {
      rows: changedRows
    };

    props.setData({
      dataName: props.objectName,
      data: newDict
    });
  };

  return (
    <div className={props.classes.dataGrid}>
      <Grid rows={rows} columns={columns} getRowId={getRowId}>
        <MachineClassProvider for={['machineClass']} />
        <ItemProvider for={['item']} />
        <TreeDataState />
        <CustomTreeData getChildRows={getChildRows} />
        <EditingState
          onCommitChanges={commitChanges}
          columnExtensions={tableColumnExtensions}
        />
        <Table columnExtensions={tableColumnExtensions} />
        <TableHeaderRow />
        <TableTreeColumn for="id" />
        <TableEditRow cellComponent={EditCell} />
        <TableEditColumn
          showAddCommand
          showEditCommand
          showDeleteCommand
          cellComponent={CommandCell}
          commandComponent={ActionButton}
        />
        {/*<FilteringState defaultFilters={[]} />*/}
        {/*<IntegratedFiltering />*/}
        {/*<SortingState*/}
        {/*  defaultSorting={[{ columnName: 'id', direction: 'desc' }]}*/}
        {/*/>*/}

        {/*<IntegratedSorting />*/}
        {/*<Table />*/}
        {/*<TableHeaderRow showSortingControls />*/}
        {/*<TableFilterRow />*/}
      </Grid>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  data: state.dataReducer[ownProps.objectName],
  data_original: state.dataReducer[ownProps.objectName + '_original'],
  MachineClass: state.dataReducer['MachineClass']
});

const mapDispatchToProps = dispatch => ({
  setData: data => dispatch(setEditorData(data))
});

export default React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(NestedEditor))
);
