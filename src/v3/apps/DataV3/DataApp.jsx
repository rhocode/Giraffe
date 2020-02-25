import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import dataParser from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/sourcetools/dataParser';
const item = require('development/Docs.json');

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

  dataParser(item);

  return <div className={classes.root}></div>;
}

export default DataApp;
