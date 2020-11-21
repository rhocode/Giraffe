import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ShareIcon from '@material-ui/icons/Share';
import React from 'react';
import { GraphObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { GoogleApiContext } from 'v3/components/GoogleAuthProvider';
import IconDialog from './IconDialog';

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

function LoginButton(props) {
  const { classes } = props;

  const { login, logout, isLoggedIn } = React.useContext(GoogleApiContext);

  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.loginDialogButton}
      size="large"
      onClick={() => {
        isLoggedIn ? logout() : login();
      }}
    >
      {' '}
      {isLoggedIn ? 'LOGOUT' : 'LOGIN WITH GOOGLE'}
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
  const { isLoggedIn } = props;
  if (isLoggedIn) {
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

  const { init, isLoggedIn } = React.useContext(GoogleApiContext);

  const { id: pixiCanvasStateId } = props;

  React.useEffect(() => {
    init();
  }, [init]);

  return (
    <IconDialog label="Share" icon={<ShareIcon />}>
      <div className={classes.shareDialog}>
        <div className={classes.loginRow}>
          {getShareBoxContent({ isLoggedIn, classes, pixiCanvasStateId })}
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
