import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setEditorData } from '../../redux/actions/Data/dataActions';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import EnumEditor from './components/EnumEditor';
import PageCloseHandler from './PageCloseHandler';

const enums = ['Item', 'MachineClass', 'Recipe'];

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
        <Tab label="MachineClass (Enum)" {...a11yProps(1)} />
        <Tab label="Recipe (Enum)" {...a11yProps(2)} />
        <Tab label="Item Four" {...a11yProps(3)} />
        <Tab label="Item Five" {...a11yProps(4)} />
        <Tab label="Item Six" {...a11yProps(5)} />
        <Tab label="Item Seven" {...a11yProps(6)} />
      </Tabs>
      {value === 0 ? (
        <TabPanel className={classes.tab}>
          <EnumEditor objectName={'Item'} />
        </TabPanel>
      ) : null}
      {value === 1 ? (
        <TabPanel className={classes.tab}>
          <EnumEditor objectName={'MachineClass'} />
        </TabPanel>
      ) : null}
      {value === 2 ? (
        <TabPanel className={classes.tab}>
          <EnumEditor objectName={'Recipe'} />
        </TabPanel>
      ) : null}
      {value === 3 ? <TabPanel className={classes.tab}>hello</TabPanel> : null}
      {value === 4 ? <TabPanel className={classes.tab}>hello</TabPanel> : null}
      {value === 5 ? <TabPanel className={classes.tab}></TabPanel> : null}
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
