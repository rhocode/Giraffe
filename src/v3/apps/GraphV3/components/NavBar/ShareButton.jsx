import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Scrollbar from 'react-scrollbars-custom';
import { GraphObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { GoogleApiContext } from 'v3/components/GoogleAuthProvider';
import IconDialog from './IconDialog';

import CloudIcon from '@material-ui/icons/Cloud';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import AddIcon from '@material-ui/icons/Add';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Typography from '@material-ui/core/Typography';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  tabHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 5,
  },
  iconDialog: {
    minWidth: 600,
  },
  shareDialog: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 500,
  },
  shareRow: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: 10,
  },
  shareColumn: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 10,
  },
  loginRow: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingBottom: 10,
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
    marginBottom: 10,
  },
  iconMargin: {
    marginLeft: 5,
  },
  buttonStyle: {
    marginBottom: 5,
    minWidth: 300,
  },
  loginText: {
    display: 'flex',
    paddingBottom: 10,
    flex: 1,
  },
  list: {
    minWidth: 250,
    minHeight: 400,
    marginRight: 5,
  },
  listItem: {
    minWidth: 180,
    maxWidth: 250,
  },
  listText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  expand: {
    flex: 1,
    display: 'flex',
    minHeight: 150,
  },
}));

function LoginButton(props) {
  const { classes } = props;

  const { login, logout, isLoggedIn } = React.useContext(GoogleApiContext);

  return (
    <Button
      variant="contained"
      color={isLoggedIn ? 'secondary' : 'primary'}
      className={classes.loginDialogButton}
      onClick={() => {
        isLoggedIn ? logout() : login();
      }}
    >
      {' '}
      {isLoggedIn ? <ExitToAppIcon /> : <OpenInNewIcon />}
      &nbsp;
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

function FileItem(props) {
  const { classes, name, description, open, local } = props;

  return (
    <ListItem className={classes.listItem}>
      <IconButton edge="start" aria-label="load">
        {local ? <AddIcon /> : open ? <CloudDoneIcon /> : <CloudDownloadIcon />}
      </IconButton>
      <ListItemText
        primary={name}
        secondary={description}
        className={classes.listText}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" color="secondary">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function FileBrowser(props) {
  const { classes } = props;

  return (
    <div className={classes.list}>
      <Typography>File List</Typography>
      <Scrollbar>
        <List dense={true} fullWidth>
          {props.children}
        </List>
      </Scrollbar>
    </div>
  );
}

function DescriptionBox(props) {
  const { classes, isLocal } = props;
  return (
    <React.Fragment>
      <div className={classes.shareRow}>
        <TextField
          spellCheck={false}
          label="Name"
          readOnly
          value={''}
          fullWidth
          variant="outlined"
        />
      </div>
      <div className={classes.shareRow}>
        <TextField
          spellCheck={false}
          label="Description"
          readOnly
          value={''}
          fullWidth
          variant="outlined"
        />
      </div>

      {isLocal ? (
        <React.Fragment />
      ) : (
        <React.Fragment>
          <div className={classes.shareRow}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={true}
                    onChange={() => {}}
                    color="primary"
                  />
                }
                label="Shareable"
              />
            </FormGroup>
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
              className={classes.iconMargin}
              size="large"
              onClick={() => {}}
            >
              <FileCopyIcon />
            </Button>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

function LocalSaveContent(props) {
  const { classes } = props;
  return (
    <React.Fragment>
      <FileBrowser {...props}>
        <FileItem
          {...props}
          name="localname1"
          local={true}
          open={true}
          description="description1"
        />
        <FileItem
          {...props}
          name="name2"
          local={true}
          open={false}
          description="description2"
        />
        <FileItem
          {...props}
          name="name3"
          local={true}
          open={false}
          description="description3description3description3description3description3description3description3description3"
        />
        <FileItem
          {...props}
          name="name2"
          local={true}
          open={false}
          description="description2"
        />
        <FileItem
          {...props}
          name="name2"
          local={true}
          open={false}
          description="description2"
        />
        <FileItem
          {...props}
          name="name2"
          local={true}
          open={false}
          description="description2"
        />
        <FileItem
          {...props}
          name="name2"
          local={true}
          open={false}
          description="description2"
        />
        <FileItem
          {...props}
          name="name2"
          local={true}
          open={false}
          description="description2"
        />
        <FileItem
          {...props}
          name="name2"
          local={true}
          open={false}
          description="description2"
        />
        <FileItem
          {...props}
          name="name2"
          local={true}
          open={false}
          description="description2"
        />
        <FileItem
          {...props}
          name="name2"
          local={true}
          open={false}
          description="description2"
        />
        <FileItem
          {...props}
          name="name2"
          local={true}
          open={false}
          description="description2"
        />
        <FileItem
          {...props}
          name="name2"
          local={true}
          open={false}
          description="description2"
        />
      </FileBrowser>
      <div className={classes.shareColumn}>
        <DescriptionBox {...props} isLocal={true} />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className={classes.buttonStyle}
        >
          <SaveIcon />
          &nbsp;Export to file
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          className={classes.buttonStyle}
        >
          <PublishIcon />
          &nbsp;Load from file
        </Button>
      </div>
    </React.Fragment>
  );
}

function CloudSaveContent(props) {
  const { classes, isLoggedIn } = props;
  return (
    <React.Fragment>
      {isLoggedIn ? (
        <div className={classes.shareColumn}>
          <FileBrowser {...props}>
            <FileItem
              {...props}
              name="cloudname1"
              local={false}
              open={true}
              description="description1"
            />
            <FileItem
              {...props}
              name="name2"
              local={false}
              open={false}
              description="description2"
            />
            <FileItem
              {...props}
              name="name3"
              local={false}
              open={false}
              description="description3description3description3description3description3description3description3description3"
            />
            <FileItem
              {...props}
              name="name2"
              local={false}
              open={false}
              description="description2"
            />
            <FileItem
              {...props}
              name="name2"
              local={false}
              open={false}
              description="description2"
            />
            <FileItem
              {...props}
              name="name2"
              local={false}
              open={false}
              description="description2"
            />
            <FileItem
              {...props}
              name="name2"
              local={false}
              open={false}
              description="description2"
            />
            <FileItem
              {...props}
              name="name2"
              local={false}
              open={false}
              description="description2"
            />
            <FileItem
              {...props}
              name="name2"
              local={false}
              open={false}
              description="description2"
            />
            <FileItem
              {...props}
              name="name2"
              local={false}
              open={false}
              description="description2"
            />
            <FileItem
              {...props}
              name="name2"
              local={false}
              open={false}
              description="description2"
            />
            <FileItem
              {...props}
              name="name2"
              local={false}
              open={false}
              description="description2"
            />
            <FileItem
              {...props}
              name="name2"
              local={false}
              open={false}
              description="description2"
            />
          </FileBrowser>
        </div>
      ) : (
        <React.Fragment />
      )}
      <div className={classes.shareColumn}>
        {isLoggedIn ? (
          <React.Fragment>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className={classes.buttonStyle}
            >
              <CloudUploadIcon />
              &nbsp;Upload current graph
            </Button>
            <DescriptionBox {...props} isLocal={false} />
            <ShareCodeBox {...props} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className={classes.expand}></div>
            <Typography className={classes.loginText}>
              Your graph is automatically saved locally.
              <br />
              Sign in to Google Drive for cloud saves.
            </Typography>
          </React.Fragment>
        )}
        <LoginButton {...props} />
        {isLoggedIn ? (
          <React.Fragment />
        ) : (
          <div className={classes.expand}></div>
        )}
      </div>
    </React.Fragment>
  );
}

function GetShareBoxContent(props) {
  const { classes } = props;
  const [tabValue, setTabValue] = React.useState(0);

  function handleChange(event, newValue) {
    setTabValue(newValue);
  }

  return (
    <React.Fragment>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        className={classes.tabHeader}
        variant="fullWidth"
        centered
      >
        <Tab label="Local" icon={<SaveIcon />} />
        <Tab label="Cloud" icon={<CloudIcon />} />
      </Tabs>
      <div className={classes.shareRow}>
        {tabValue === 0 && <LocalSaveContent {...props} />}
        {tabValue === 1 && <CloudSaveContent {...props} />}
      </div>
    </React.Fragment>
  );
}

function ShareButton(props) {
  const classes = useStyles();

  const { init, isLoggedIn } = React.useContext(GoogleApiContext);

  const { id: pixiCanvasStateId } = props;

  React.useEffect(() => {
    init();
  }, [init]);

  return (
    <IconDialog
      label="Save/Share"
      icon={isLoggedIn ? <CloudIcon /> : <SaveIcon />}
      className={classes.iconDialog}
    >
      <div className={classes.shareDialog}>
        {GetShareBoxContent({ isLoggedIn, classes, pixiCanvasStateId })}

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
