import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';

import {
  Grid,
  Table,
  TableEditColumn,
  TableEditRow,
  TableHeaderRow
} from '@devexpress/dx-react-grid-material-ui';
import {
  EditingState,
  IntegratedSorting,
  SortingState
} from '@devexpress/dx-react-grid';
import { setEditorData } from '../../../redux/actions/Data/dataActions';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import { throttle } from 'throttle-debounce';

const styles = theme => {
  return {
    dataGrid: {
      gridArea: 'gridarea'
    }
  };
};

const getRowId = row => row.id;

// const LookupEditCellBase = ({ value, onValueChange, classes, customDropDownItems }) => (
//   <TableCell
//     className={classes.lookupEditCell}
//   >
//     <Select
//       // ...
//     >
//       {customDropDownItems.map(item => (
//         <MenuItem key={item} value={item}>{item}</MenuItem>
//       ))}
//     </Select>
//   </TableCell>
// );

const MemoizedTable = React.memo(Table);

const EditCell = props => {
  const [errored, setErrored] = useState(true);
  const [text, setText] = useState(props.value ? '' + props.value : '');

  const copiedProps = {};
  if (!props.editingEnabled) {
    copiedProps['value'] = '(Autogenerated)';
  } else {
    return (
      <TableCell>
        <TextField
          value={text}
          onChange={e => {
            const value = e.target.value.toLowerCase().replace(/[\s-]/g, '_');

            if (
              removeChars('abcdefghijklmnopqrstuvwxyz0123456789_', value) ===
                value &&
              value.length > 0
            ) {
              props.onValueChange(value);
              setText(value);
            } else if (value.length === 0) {
              setText(value);
              props.onValueChange('INVALID_ENUM_NAME');
            }
          }}
          margin="normal"
          fullWidth
        />
      </TableCell>
    );
  }

  const newProps = Object.assign({}, props, copiedProps);

  return <TableEditRow.Cell {...newProps} />;

  // return <TableCell>
  //   {/*<Select*/}
  //   {/*  value={text}*/}
  //   {/*  onChange={event => {*/}
  //   {/*    props.onValueChange(event.target.value);*/}
  //   {/*    setText(event.target.value);*/}
  //   {/*  }}*/}
  //   {/*  input={*/}
  //   {/*    <Input*/}
  //   {/*      // classes={{ root: classes.inputRoot }}*/}
  //   {/*    />*/}
  //   {/*  }*/}
  //   {/*>*/}
  //   {/*  {[{id: 1, name: "1"}, {id: 2, name: "12"}].map(item => (*/}
  //   {/*    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>*/}
  //   {/*  ))}*/}
  //   {/*</Select>*/}
  //   <TextField
  //      value={text}
  //      onChange={(e) => setText(e.target.value)}
  //      margin="normal"
  //      fullWidth
  //   />
  //
  // </TableCell>

  // <TextField
  //   value={text}
  //   onChange={(e) => setText(e.target.value)}
  //   margin="normal"
  // />
};

const CommandCell = props => (
  <TableEditColumn.Cell {...props}>
    {React.Children.toArray(props.children).map(child => {
      if (child.props.id === 'delete' && !props.tableRow.row.local) {
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

function EnumEditor(props) {
  // Declare a new state variable, which we'll call "count"
  const [columns] = useState([
    { name: 'id', title: 'ID' },
    { name: 'enum', title: 'Enum' }
  ]);

  const rows = props.data ? props.data.rows : [];
  const rowNames = new Set([...rows.map(item => item.enum)]);

  const [editingStateColumnExtensions] = useState([
    { columnName: 'id', editingEnabled: false }
  ]);

  const commitChanges = ({ added, changed, deleted }) => {
    let changedRows;

    if (added) {
      const startingAddedId = Math.max(...rows.map(item => item.id), -1) + 1;
      const addedRows = added
        .map((row, index) => {
          console.error('AAAAAA', row);
          return {
            id: startingAddedId + index,
            local: true,
            ...row,
            enum: removeChars(
              'abcdefghijklmnopqrstuvwxyz0123456789_',
              row.enum.toLowerCase().replace(/-/g, '_')
            )
          };
        })
        .filter(item => {
          return !rowNames.has(item.enum) && item.enum.length > 0;
        });

      changedRows = [...rows, ...addedRows];
    }
    if (changed) {
      changedRows = rows.map(row =>
        changed[row.id] ? { ...row, ...changed[row.id] } : row
      );
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => !deletedSet.has(row.id));
    }

    const newDict = {
      rows: changedRows,
      reserved: props.data.reserved
    };

    props.setData({
      dataName: props.objectName,
      data: newDict
    });
  };

  return (
    <div className={props.classes.dataGrid}>
      <Grid rows={rows} columns={columns} getRowId={getRowId}>
        <SortingState
          defaultSorting={[{ columnName: 'id', direction: 'desc' }]}
        />
        <EditingState
          onCommitChanges={commitChanges}
          columnExtensions={editingStateColumnExtensions}
        />
        <IntegratedSorting />
        <Table />
        <TableHeaderRow showSortingControls />
        <TableEditRow cellComponent={EditCell} />
        <TableEditColumn
          showAddCommand
          showEditCommand
          showDeleteCommand
          cellComponent={CommandCell}
        />
      </Grid>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  data: state.dataReducer[ownProps.objectName]
});

const mapDispatchToProps = dispatch => ({
  setData: data => dispatch(setEditorData(data))
});

export default React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(EnumEditor))
);
