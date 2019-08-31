import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';

import {
  Grid,
  Table,
  TableEditColumn,
  TableEditRow,
  TableFilterRow,
  TableHeaderRow
} from '@devexpress/dx-react-grid-material-ui';
import {
  DataTypeProvider,
  EditingState,
  FilteringState,
  IntegratedFiltering,
  IntegratedSorting,
  SortingState
} from '@devexpress/dx-react-grid';
import { setEditorData } from '../../../redux/actions/Data/dataActions';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import * as protobuf from 'protobufjs/light';
import getLatestSchema from '../../Graph/libraries/SGLib/utils/getLatestSchema';
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
  return row.id + '_' + row.tier;
};

const ActionButton = props => {
  return <TableEditColumn.Command {...props} />;
};

const tierEnumToString = {};

const root = protobuf.Root.fromJSON(getLatestSchema());
const UpgradeTiers = root.lookupEnum('UpgradeTiers');
const UpgradeTierFormatter = ({ value }) => {
  return UpgradeTiers.valuesById[value] || '';
};

Object.keys(UpgradeTiers.values).forEach(key => {
  const enm = UpgradeTiers.values[key];
  tierEnumToString[enm] = key;
});

const columnLookup = {
  tier: tierEnumToString
};

const EditCell = props => {
  const [text, setText] = useState(
    props.value !== undefined ? '' + props.value : ''
  );

  const lookup = columnLookup[props.column.name];

  if (lookup) {
    const reverseLookup = {};
    const suggestions = Object.keys(lookup).map(key => {
      reverseLookup[lookup[key]] = key;
      return { label: lookup[key], value: key };
    });

    return (
      <TableCell>
        <AutoSuggest
          initialValue={lookup[text]}
          suggestions={suggestions}
          translate={a => reverseLookup[a]}
          postChangeEvent={value => {
            props.onValueChange(value);
          }}
        />
      </TableCell>
    );
  }

  return (
    <TableCell>
      <TextField
        value={text}
        onChange={e => {
          const value = e.target.value;
          setText(value);
          props.onValueChange(value);
        }}
        margin="normal"
        fullWidth
      />
    </TableCell>
  );
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

const UpgradeTierProvider = props => (
  <DataTypeProvider formatterComponent={UpgradeTierFormatter} {...props} />
);

function FlatEditor(props) {
  // Declare a new state variable, which we'll call "count"
  const [columns] = useState([
    { name: 'id', title: 'ID' },
    { name: 'tier', title: 'Tier' },
    { name: 'inputs', title: 'Number of Inputs' },
    { name: 'localOrdering', title: 'Local Ordering' },
    { name: 'name', title: 'Translation Key' },
    { name: 'outputs', title: 'Number of Output' },
    { name: 'power', title: 'Power' },
    { name: 'speed', title: 'Speed' }
  ]);

  const rows = props.data ? props.data.rows : [];

  const intColumns = new Set([
    'tier',
    'inputs',
    'outputs',
    'localOrdering',
    'power'
  ]);
  const decimalColumns = new Set(['speed']);

  const [tableColumnExtensions] = useState([
    { columnName: 'id', width: 250 },
    { columnName: 'name', width: 250 }
  ]);

  const commitChanges = ({ added, changed, deleted }) => {
    let changedRows;
    if (added) {
      changedRows = [
        ...rows,
        ...added.map(row => ({
          // if we have to map more shit
          ...row
        }))
      ];
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
          } else if (typeof value === 'boolean') {
            newData[key] = value;
          } else {
            const inputValue = deburr(value.trim()).toLowerCase();
            if (inputValue !== '') {
              newData[key] = deburr(value.trim());
            }
          }
        });

        return newData;
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
  return (
    <div className={props.classes.dataGrid}>
      <Grid rows={rows} columns={columns} getRowId={getRowId}>
        <UpgradeTierProvider for={['tier']} />
        <FilteringState defaultFilters={[]} />
        <IntegratedFiltering />
        <SortingState
          defaultSorting={[{ columnName: 'id', direction: 'asc' }]}
        />
        <EditingState onCommitChanges={commitChanges} />
        <IntegratedSorting />
        <Table columnExtensions={tableColumnExtensions} />
        <TableHeaderRow showSortingControls />
        <TableFilterRow />
        <TableEditRow cellComponent={EditCell} />
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
  data_original: state.dataReducer[ownProps.objectName + '_original']
});

const mapDispatchToProps = dispatch => ({
  setData: data => dispatch(setEditorData(data))
});

export default React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(FlatEditor))
);
