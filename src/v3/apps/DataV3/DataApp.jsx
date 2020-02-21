import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import PageCloseHandler from '../../../apps/Data/PageCloseHandler';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import NestedEditor from 'apps/Data/components/NestedEditor';
import FlatEditor from 'apps/Data/components/FlatEditor';
import DiffUploader from 'apps/Data/components/DiffUploader';
import { setEditorData } from 'redux/actions/Data/dataActions';
import { connect } from 'react-redux';
import EnumEditor from 'apps/Data/components/EnumEditor';

import {
  machineInstanceListPromise,
  recipeListPromise
} from 'v3/data/promises/dataPromises';
import dataParser from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/sourcetools/dataParser';
const item = require('development/Docs.json');

dataParser(item);

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

// const importEnumJSON = enm => {
//   const data = require('proto/' + enm + '.json');
//   const enums = data.nested.satisgraphtory.nested[enm].values;
//   const reserved = data.nested.satisgraphtory.nested[enm].reserved;
//
//   return {
//     enums,
//     reserved
//   };
// };

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
  }
}));

// const enums = ['UpgradeTiers', 'Item', 'MachineClass', 'Recipe'];

function DataApp(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const dataListsRef = React.useRef([
    {
      name: 'RecipeList',
      mapper: recipeClassMapper,
      data: recipeListPromise()
    },
    {
      name: 'MachineClassList',
      mapper: raw => {
        return Object.values(raw);
      },
      data: machineInstanceListPromise()
    }
  ]);

  const dataLists = dataListsRef.current;
  console.log(dataLists);

  // useEffect(() => {
  //   enums.forEach(enm => {
  //     const imported = importEnumJSON(enm);
  //
  //     const usedData = [];
  //
  //     Object.keys(imported.enums).forEach(key => {
  //       usedData.push({ enum: key, id: imported.enums[key] });
  //     });
  //
  //     props.setData({
  //       dataName: enm,
  //       data: {
  //         reserved: imported.reserved || [],
  //         rows: usedData
  //       }
  //     });
  //   });
  //
  //   dataLists.forEach(promise => {
  //     promise.data.then(data => {
  //       const mappedData = promise.mapper(data);
  //       props.setData({
  //         dataName: promise.name,
  //         data: {
  //           rows: mappedData
  //         }
  //       });
  //     });
  //   });
  // }, [dataLists, props]);

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

const mapDispatchToProps = dispatch => ({
  setData: data => dispatch(setEditorData(data))
});

export default connect(null, mapDispatchToProps)(DataApp);
