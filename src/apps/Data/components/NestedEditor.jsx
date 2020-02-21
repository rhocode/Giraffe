import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core';

import {
  Grid,
  Table,
  TableEditColumn,
  TableEditRow,
  TableFilterRow,
  TableHeaderRow,
  TableTreeColumn
} from '@devexpress/dx-react-grid-material-ui';
import {
  CustomTreeData,
  DataTypeProvider,
  EditingState,
  FilteringState,
  IntegratedFiltering,
  SortingState,
  TreeDataState
} from '@devexpress/dx-react-grid';
import { setEditorData } from '../../../redux/actions/Data/dataActions';
import TableCell from '@material-ui/core/TableCell';
import AutoSuggest from './AutoSuggest';
import deburr from 'lodash/deburr';

const styles = theme => {
  return {
    dataGrid: {
      // gridArea: 'gridarea',
      // justifySelf: 'start'
    }
  };
};

const getRowId = row => {
  return (row.id || row.parentId) + '_' + row.internalId;
};

const ActionButton = props => {
  return <TableEditColumn.Command {...props} />;
};

const availableFilterOperations = [
  'equal',
  'notEqual',
  'greaterThan',
  'greaterThanOrEqual',
  'lessThan',
  'lessThanOrEqual'
];

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

const EditCell = (props, columnLookup) => {
  const classes = useStyles();

  const lookup = columnLookup[props.column.name];

  const [value, setValue] = React.useState(
    props.value === undefined ? '' : props.value
  );

  React.useEffect(() => {
    const data = props.row.parentPointer
      ? props.row.parentPointer[props.column.name]
      : undefined;
    if (data !== undefined) {
      if (data !== value) {
        setValue(data);
      }
    }
  }, [props.column.name, props.row.parentPointer, value]);

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
      if (!parentEditableSet.has(props.column.name)) {
        newProps.value = '';
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

  if (lookup !== undefined) {
    const usedValue = useParentValue ? newProps.value : value;

    const reverseLookup = {};
    const suggestions = Object.keys(lookup).map(key => {
      reverseLookup[lookup[key]] = key;
      return { label: lookup[key], value: key };
    });

    return (
      <TableCell className={classes.lookupEditCell}>
        <AutoSuggest
          initialValue={lookup[usedValue]}
          suggestions={suggestions}
          disabled={disableDropdown}
          translate={a => reverseLookup[a]}
          postChangeEvent={value => {
            props.onValueChange(value);
          }}
        />
      </TableCell>
    );
  }

  return <TableEditRow.Cell {...props} {...newProps} />;
};

const CommandCell = props => (
  <TableEditColumn.Cell {...props}>
    {React.Children.toArray(props.children).map(child => {
      if (
        child.props.id === 'delete' &&
        !props.tableRow.row.local &&
        props.tableRow.row.parentId === undefined
      ) {
        const newProps = Object.assign({}, child.props, { disabled: true });
        return Object.assign({}, child, { props: newProps });
      } else {
        return child;
      }
    })}
  </TableEditColumn.Cell>
);

const getChildRows = (row, rootRows) => {
  const childRows = rootRows.filter(r => r.parentId === (row ? row.id : null));
  return childRows.length ? childRows : null;
};

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

  const intColumns = new Set([
    'machineClass',
    'time',
    'outputs',
    'item',
    'qty'
  ]);
  const decimalColumns = new Set([]);

  const rows = props.data ? props.data.rows : [];

  const rowSet = new Set(rows.filter(row => row.id).map(row => row.id));
  const [tableColumnExtensions] = useState([{ columnName: 'id', width: 300 }]);

  const commitChanges = ({ added, changed, deleted }) => {
    let changedRows;

    if (added) {
      const addedRows = [];

      added
        .filter(row => row.id)
        .forEach(row => {
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

    changedRows = changedRows
      .map(row => {
        const newData = {};
        Object.keys(row).forEach(key => {
          let value = row[key];
          if (value === undefined || value === null) {
            value = '';
          }
          if (intColumns.has(key)) {
            const newValue = parseInt(value);
            if (!isNaN(newValue)) {
              newData[key] = newValue;
            }
          } else if (decimalColumns.has(key)) {
            const newValue = parseFloat(value);
            if (!isNaN(newValue)) {
              newData[key] = newValue;
            }
          } else if (
            typeof value === 'boolean' ||
            typeof value === 'number' ||
            typeof value === 'object'
          ) {
            newData[key] = value;
          } else {
            // if (value === undefined || value === null) {
            //   value = '';
            // }
            const inputValue = deburr(value.trim()).toLowerCase();
            if (inputValue !== '') {
              newData[key] = deburr(value.trim());
            }
          }
        });
        const parentId =
          newData.parentId !== undefined ? newData.parentId : null;
        return { ...newData, parentId };
      })
      .filter(data => Object.keys(data).length > 0);

    const newDict = {
      rows: changedRows
    };

    props.setData({
      dataName: props.objectName,
      data: newDict
    });
  };

  const machineClassMapper = {};
  if (props.MachineClass && props.MachineClass.rows) {
    props.MachineClass.rows.forEach(row => {
      machineClassMapper[row.id] = row.enum;
    });
  }

  const MachineClassFormatter = ({ value }) => {
    return machineClassMapper[value] || '';
  };

  const MachineClassProvider = props => (
    <DataTypeProvider
      availableFilterOperations={availableFilterOperations}
      formatterComponent={MachineClassFormatter}
      {...props}
    />
  );

  const itemMapper = {};
  if (props.Item && props.Item.rows) {
    props.Item.rows.forEach(row => {
      itemMapper[row.id] = row.enum;
    });
  }

  const ItemFormatter = ({ value }) => {
    return itemMapper[value] || '';
  };

  const ItemProvider = props => (
    <DataTypeProvider
      availableFilterOperations={availableFilterOperations}
      formatterComponent={ItemFormatter}
      {...props}
    />
  );

  const columnLookup = {
    machineClass: machineClassMapper,
    item: itemMapper,
    itemType: { input: 'input', output: 'output' }
  };

  return (
    <div className={props.classes.dataGrid}>
      <Grid rows={rows} columns={columns} getRowId={getRowId}>
        <MachineClassProvider for={['machineClass']} />
        <ItemProvider for={['item']} />
        <FilteringState defaultFilters={[]} />
        <IntegratedFiltering />
        <SortingState
          defaultSorting={[{ columnName: 'id', direction: 'desc' }]}
        />
        <TreeDataState />
        <CustomTreeData getChildRows={getChildRows} />
        <EditingState
          onCommitChanges={commitChanges}
          columnExtensions={tableColumnExtensions}
        />
        <Table columnExtensions={tableColumnExtensions} />
        <TableHeaderRow showSortingControls />
        <TableFilterRow />
        <TableTreeColumn for="id" />
        <TableEditRow cellComponent={props => EditCell(props, columnLookup)} />
        <TableEditColumn
          showAddCommand
          showEditCommand
          showDeleteCommand
          cellComponent={CommandCell}
          commandComponent={ActionButton}
        />
      </Grid>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  data: state.dataReducer[ownProps.objectName],
  data_original: state.dataReducer[ownProps.objectName + '_original'],
  MachineClass: state.dataReducer['MachineClass'],
  Item: state.dataReducer['Item']
});

const mapDispatchToProps = dispatch => ({
  setData: data => dispatch(setEditorData(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(NestedEditor));
