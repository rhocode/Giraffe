import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ShareIcon from '@material-ui/icons/Share';
import gapi from 'gapi-client';
import React from 'react';
import { GraphObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import { globalGraphAppStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/GlobalGraphAppStore';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import IconDialog from './IconDialog';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const useStyles = makeStyles((theme) => ({
  shareDialog: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  shareRow: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loginRow: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imageRow: {
    paddingTop: '10px',
    flexDirection: 'row',
  },
  divider: {
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  inlineDialogButton: {
    height: '100%',
    marginTop: 4,
  },
  loginDialogButton: {
    height: '100%',
  },
  copyToClipboard: {
    marginLeft: 5,
  },
}));

const CLIENT_ID = process.env.REACT_APP_GCLOUD_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GCLOUD_API_KEY;

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

function LoginButton(props) {
  const { isSignedIn, classes } = props;

  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.loginDialogButton}
      size="large"
      onClick={() => {
        isSignedIn
          ? gapi.auth2.getAuthInstance().signOut()
          : gapi.auth2.getAuthInstance().signIn();
      }}
    >
      {' '}
      {isSignedIn ? 'LOGOUT' : 'LOGIN WITH GOOGLE'}
    </Button>
  );
}

function ShareCodeBox(props) {
  const serializedGraph = pixiJsStore.useState((sParent) => {
    const s = sParent[props.pixiCanvasStateId];
    if (s.childrenMap) {
      return [...s.childrenMap.values()].filter(
        (obj) => obj instanceof GraphObject
      );
    }

    return null;
  });

  console.log(serializedGraph);
  return null;
}

function getShareBoxContent(props) {
  const { isSignedIn } = props;
  if (isSignedIn) {
    return (
      <React.Fragment>
        <LoginButton {...props} />
        <ShareCodeBox {...props} />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <LoginButton {...props} />
      </React.Fragment>
    );
  }
}

function ShareButton(props) {
  const classes = useStyles();

  const { id: pixiCanvasStateId } = props;

  const isSignedIn = globalGraphAppStore.useState((s) => {
    return s.signedIn;
  });

  React.useEffect(() => {
    //On load, called to load the auth2 library and API client library.
    gapi.load('client:auth2', initClient);

    // Initialize the API client library
    function initClient() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(function () {
          globalGraphAppStore.update((s) => {
            s.signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
          });
          gapi.auth2.getAuthInstance().isSignedIn.listen((status) => {
            globalGraphAppStore.update((s) => {
              s.signedIn = status;
            });
          });
        });
    }
  }, [pixiCanvasStateId]);

  return (
    <IconDialog label="Share" icon={<ShareIcon />}>
      <div className={classes.shareDialog}>
        <div className={classes.loginRow}>
          {getShareBoxContent({ isSignedIn, classes, pixiCanvasStateId })}
        </div>
        <div className={classes.shareRow}>
          <TextField
            spellCheck={false}
            label="Share Code"
            readOnly
            value={''}
            fullWidth
            variant="outlined"
          />
          <Button
            variant="outlined"
            color="primary"
            className={classes.copyToClipboard}
            size="large"
            onClick={() => {}}
          >
            <FileCopyIcon />
          </Button>
        </div>
        <Button
          variant="contained"
          color="secondary"
          className={classes.inlineDialogButton}
          size="large"
          onClick={() => {}}
        >
          Generate Share Code
          {/* <div className={classes.label}>Copy</div> */}
        </Button>

        {/*<div className={classes.divider}></div>*/}
        {/*<div className={classes.imageRow}>*/}
        {/*  <Button*/}
        {/*    fullWidth*/}
        {/*    color="primary"*/}
        {/*    size="large"*/}
        {/*    endIcon={<PhotoSizeSelectActualIcon />}*/}
        {/*  >*/}
        {/*    <div className={classes.label}>Export Image</div>*/}
        {/*  </Button>*/}
        {/*</div>*/}
        {/*//TODO: Fix serialize*/}
        {/*<GraphSerializeButton />*/}
      </div>
    </IconDialog>
  );
}

export default ShareButton;
