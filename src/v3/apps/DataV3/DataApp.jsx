import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import initRuntime from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/initRuntime';
// import { GET_RECIPES_BY_MACHINE } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/graphql/queries';
// import gqlClient from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/graphql/gqlClient';
// import dataParser from '../GraphV3/libraries/SatisGraphtoryLib/sourcetools/dataParser';
//
// const item = require('development/Docs.json');

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

function DataApp() {
  const classes = useStyles();

  React.useEffect(() => {
    // dataParser(item);
    //
    initRuntime();
  }, []);

  // console.log('@@#fff@');
  // const client = gqlClient();
  // client
  //   .query({
  //     query: GET_RECIPES_BY_MACHINE
  //   })
  //   .then(response => {
  //     console.log(response);
  //   });

  return <div className={classes.root} />;
}

export default DataApp;
