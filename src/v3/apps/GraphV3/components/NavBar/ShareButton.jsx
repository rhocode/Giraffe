import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import CloudIcon from '@material-ui/icons/Cloud';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import GetAppIcon from '@material-ui/icons/GetApp';
import SaveIcon from '@material-ui/icons/Save';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import produce from 'immer';
import React from 'react';
import Scrollbar from 'react-scrollbars-custom';
import ModalOpenTrigger from 'v3/apps/GraphV3/components/ModalOpenTrigger/ModalOpenTrigger';
import { GraphObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import serializeGraphObjects from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/serialization/serialize';
import {
  pixiJsStore,
  replaceGraphData,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { GoogleApiContext } from 'v3/components/GoogleAuthProvider';
import { LocaleContext } from 'v3/components/LocaleProvider';
import uuidGen from 'v3/utils/stringUtils';
import IconDialog from './IconDialog';
import { Checkbox } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  tabHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  iconDialog: {
    minWidth: 600,
  },
  shareDialog: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  shareRow: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: 10,
    maxHeight: 'calc(100% - 128px)',
  },
  shareColumn: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 10,
    minHeight: 312,
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
  },
  loginText: {
    display: 'flex',
    paddingBottom: 10,
    flex: 1,
  },
  fileBrowserList: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  fileBrowserTitle: {
    flexGrow: 0,
  },
  fileBrowserCurrentlyLoadedFile: {
    flexGrow: 0,
  },
  fileBrowserContent: {
    flexGrow: 1,
  },
  listItem: {},
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
  gridItem: {
    width: 300,
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
  // const serializedGraph = pixiJsStore.useState((sParent) => {
  //   const s = sParent[props.pixiCanvasStateId];
  //   if (s.childrenMap) {
  //     return [...s.childrenMap.values()].filter(
  //       (obj) => obj instanceof GraphObject
  //     );
  //   }
  //
  //   return null;
  // });
  //
  // console.log(serializedGraph);
  return null;
}

function FileItem(props) {
  const {
    classes,
    name,
    description,
    open,
    local,
    pixiCanvasStateId,
    deleteButtonAction,
    data,
    setOverwrite,
    loadGraphEnabled,
  } = props;

  const { translate } = React.useContext(LocaleContext);

  return (
    <ListItem button className={classes.listItem}>
      <IconButton
        edge="start"
        aria-label="load"
        disabled={!loadGraphEnabled}
        onClick={() => {
          pixiJsStore.update((sParent) => {
            const s = sParent[pixiCanvasStateId];
            s.lastSelectedSave.name = data.n;
            s.lastSelectedSave.description = data.q;
            s.lastUsedSave.name = data.n;
            s.lastUsedSave.hash = data.h;
          });

          setOverwrite(false);
          replaceGraphData(pixiCanvasStateId, data, translate);
        }}
      >
        {local ? (
          <GetAppIcon />
        ) : open ? (
          <CloudDoneIcon />
        ) : (
          <CloudDownloadIcon />
        )}
      </IconButton>
      <ListItemText
        onClick={() => {
          pixiJsStore.update((sParent) => {
            const s = sParent[pixiCanvasStateId];
            s.lastSelectedSave.name = data.n;
            s.lastSelectedSave.description = data.q;
          });
        }}
        primary={name}
        secondary={description}
        className={classes.listText}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          color="secondary"
          onClick={deleteButtonAction}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function FileBrowser(props) {
  const { classes, canOverwrite, setCanOverwrite } = props;

  return (
    <div className={classes.fileBrowserList}>
      <div className={classes.fileBrowserTitle}>
        <Typography>File List</Typography>
      </div>
      <div className={classes.fileBrowserContent}>
        <Scrollbar>
          <List dense={true}>{props.children}</List>
        </Scrollbar>
      </div>
      <div className={classes.fileBrowserCurrentlyLoadedFile}>
        <FormControlLabel
          control={
            <Checkbox
              checked={canOverwrite}
              onChange={(evt, value) => setCanOverwrite(value)}
              name="canOverwrite"
            />
          }
          label="Overwrite Displayed Graph"
        />
      </div>
    </div>
  );
}

function DescriptionBox(props) {
  const { classes, name, setName, description, setDescription } = props;
  return (
    <React.Fragment>
      <div className={classes.shareRow}>
        <TextField
          spellCheck={false}
          label="Name"
          value={name}
          onChange={(evt) => {
            setName(evt.target.value);
          }}
          fullWidth
          variant="outlined"
          placeholder={'My Awesome Design'}
        />
      </div>
      <div className={classes.shareRow}>
        <TextField
          spellCheck={false}
          label="Description"
          value={description}
          onChange={(evt) => {
            setDescription(evt.target.value);
          }}
          fullWidth
          variant="outlined"
        />
      </div>

      {/*{isLocal ? (*/}
      {/*  <React.Fragment/>*/}
      {/*) : (*/}
      {/*  <React.Fragment>*/}
      {/*    <div className={classes.shareRow}>*/}
      {/*      <FormGroup>*/}
      {/*        <FormControlLabel*/}
      {/*          control={*/}
      {/*            <Checkbox*/}
      {/*              checked={true}*/}
      {/*              onChange={() => {*/}
      {/*              }}*/}
      {/*              color="primary"*/}
      {/*            />*/}
      {/*          }*/}
      {/*          label="Shareable"*/}
      {/*        />*/}
      {/*      </FormGroup>*/}
      {/*    </div>*/}
      {/*    <div className={classes.shareRow}>*/}
      {/*      <TextField*/}
      {/*        spellCheck={false}*/}
      {/*        label="Share Code"*/}
      {/*        readOnly*/}
      {/*        value={''}*/}
      {/*        fullWidth*/}
      {/*        variant="outlined"*/}
      {/*      />*/}
      {/*      <Button*/}
      {/*        variant="outlined"*/}
      {/*        color="primary"*/}
      {/*        className={classes.iconMargin}*/}
      {/*        size="large"*/}
      {/*        onClick={() => {*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <FileCopyIcon/>*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </React.Fragment>*/}
      {/*)}*/}
    </React.Fragment>
  );
}

const cacheFunction = (designs, setDesigns) => () => {
  caches.open('satisgraphtory-local-cache').then((cache) => {
    return cache.match('/manifest.json').then((manifest) => {
      if (manifest === undefined) {
        const token = uuidGen();
        const manifestContents = {
          token,
          designs: {},
        };
        return cache
          .put('/manifest.json', new Response(JSON.stringify(manifestContents)))
          .then(() => {
            console.log('Setting designs as default');
            setDesigns(manifestContents);
            return manifestContents;
          });
      } else {
        return manifest.json().then((resp) => {
          if (resp.token !== designs.token) {
            setDesigns(resp);
          }

          return resp;
        });
      }
    });
  });
};

const addOrUpdateCacheFile = (
  designs,
  setDesigns,
  overWrite,
  setOverWrite,
  designId,
  designData,
  pixiCanvasStateId
) => {
  caches.open('satisgraphtory-local-cache').then((cache) => {
    cache.match('/manifest.json').then((manifest) => {
      const addOrUpdateCacheFunction = (oldManifest) => {
        const thisDesign = oldManifest.designs[designId];

        // Check if
        if (thisDesign && !overWrite) {
          setOverWrite(true);
          return Promise.resolve(oldManifest);
        } else {
          // if (!thisDesign || (thisDesign?.h === designData.h)) {
          const newManifest = produce(oldManifest, (om) => {
            om.designs[designId] = designData;
            om.token = uuidGen();
          });

          if (thisDesign && overWrite) {
            setOverWrite(false);
          }

          pixiJsStore.update((sParent) => {
            const s = sParent[pixiCanvasStateId];
            s.lastSelectedSave.name = designData.n;
            s.lastSelectedSave.description = designData.q;
            s.lastUsedSave.name = designData.n;
            s.lastUsedSave.hash = designData.h;
          });

          return cache
            .put('/manifest.json', new Response(JSON.stringify(newManifest)))
            .then(() => newManifest);
        }
        // }
        //
        // return Promise.resolve(oldManifest)
      };

      if (manifest === undefined) {
        cacheFunction(designs, setDesigns)
          .then(addOrUpdateCacheFunction)
          .then(cacheFunction(designs, setDesigns));
      } else {
        manifest
          .json()
          .then(addOrUpdateCacheFunction)
          .then(cacheFunction(designs, setDesigns));
      }
    });
  });
};

const deleteCacheFile = (designs, setDesigns, designId) => {
  caches.open('satisgraphtory-local-cache').then((cache) => {
    cache.match('/manifest.json').then((manifest) => {
      const deleteCacheFunction = (oldManifest) => {
        const newManifest = produce(oldManifest, (om) => {
          delete om.designs[designId];
          om.token = uuidGen();
        });

        return cache
          .put('/manifest.json', new Response(JSON.stringify(newManifest)))
          .then(() => newManifest);
      };

      if (manifest === undefined) {
        cacheFunction(designs, setDesigns)
          .then(deleteCacheFunction)
          .then(cacheFunction(designs, setDesigns));
      } else {
        manifest
          .json()
          .then(deleteCacheFunction)
          .then(cacheFunction(designs, setDesigns));
      }
    });
  });
};

function renderLocalDesignData(
  designData,
  props,
  designs,
  setDesigns,
  setOverwrite,
  loadGraphEnabled,
  lastLoadedName
) {
  const entries = Object.entries(designData);
  if (entries.length === 0) {
    return <Typography>No saved files.</Typography>;
  }
  return entries.map(([key, value]) => {
    return (
      <FileItem
        {...props}
        loadGraphEnabled={loadGraphEnabled}
        name={value.n}
        local={true}
        open={false}
        description={value.q}
        key={value.n}
        data={value}
        deleteButtonAction={() => {
          deleteCacheFile(designs, setDesigns, value.n);
        }}
        setOverwrite={setOverwrite}
      />
    );
  });
}

function LocalSaveContent(props) {
  const [designData, setDesignData] = React.useState({
    token: '',
    designs: {},
  });

  React.useEffect(() => {
    const interval = setInterval(
      cacheFunction(designData, setDesignData),
      10000
    );
    cacheFunction(designData, setDesignData)();
    return () => clearInterval(interval);
  }, [designData]);

  const graphObjects = pixiJsStore.useState((sParent) => {
    const s = sParent[props.pixiCanvasStateId];
    if (s.childrenMap) {
      return [...s.childrenMap.values()].filter(
        (obj) => obj instanceof GraphObject
      );
    }

    return [];
  });

  const lastOpenedSave = pixiJsStore.useState((sParent) => {
    const s = sParent[props.pixiCanvasStateId];
    return s.lastSelectedSave;
  });

  const [name, setName] = React.useState(lastOpenedSave.name);
  const [description, setDescription] = React.useState(
    lastOpenedSave.description
  );

  const [overWrite, setOverWrite] = React.useState(false);

  const setNameFunction = React.useCallback(
    (newName) => {
      if (newName !== name && overWrite) {
        setOverWrite(false);
      }

      setName(newName);
    },
    [name, overWrite]
  );

  React.useEffect(() => {
    setDescription(lastOpenedSave.description);
    setName(lastOpenedSave.name);
  }, [lastOpenedSave]);

  const designName = name || uuidGen();

  const newDesignData = {
    ...serializeGraphObjects(graphObjects),
    q: description || uuidGen(),
    n: designName,
  };

  const { lastUsedSaveName, lastUsedSaveHash } = pixiJsStore.useState(
    (sParent) => {
      const s = sParent[props.pixiCanvasStateId];
      return {
        lastUsedSaveName: s.lastUsedSave.name,
        lastUsedSaveHash: s.lastUsedSave.hash,
      };
    }
  );

  const [canOverwrite, setCanOverwrite] = React.useState(false);

  const loadGraphEnabled = newDesignData.h === lastUsedSaveHash || canOverwrite;

  const { classes, pixiCanvasStateId } = props;
  return (
    <Grid container spacing={2}>
      <Grid classes={{ item: classes.gridItem }} item xs={6}>
        <FileBrowser
          canOverwrite={canOverwrite}
          setCanOverwrite={setCanOverwrite}
          {...props}
        >
          {renderLocalDesignData(
            designData.designs,
            props,
            designData,
            setDesignData,
            setOverWrite,
            loadGraphEnabled,
            lastUsedSaveName
          )}
        </FileBrowser>
      </Grid>
      <Grid classes={{ item: classes.gridItem }} item xs={6}>
        <div className={classes.shareColumn}>
          <DescriptionBox
            name={name}
            setName={setNameFunction}
            description={description}
            setDescription={setDescription}
            {...props}
            isLocal={true}
          />
          <Button
            variant="contained"
            color={overWrite ? 'secondary' : 'primary'}
            fullWidth
            className={classes.buttonStyle}
            onClick={() => {
              addOrUpdateCacheFile(
                designData,
                setDesignData,
                overWrite,
                setOverWrite,
                designName,
                newDesignData,
                pixiCanvasStateId
              );
            }}
          >
            {overWrite ? (
              <React.Fragment>
                <SaveAltIcon />
                &nbsp;Overwrite Existing Save
              </React.Fragment>
            ) : (
              <React.Fragment>
                <SaveAltIcon />
                &nbsp;Save in Browser
              </React.Fragment>
            )}
          </Button>
          {/*<Button*/}
          {/*  variant="contained"*/}
          {/*  color="primary"*/}
          {/*  fullWidth*/}
          {/*  className={classes.buttonStyle}*/}
          {/*>*/}
          {/*  <SaveIcon />*/}
          {/*  &nbsp;Export to File*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  variant="contained"*/}
          {/*  color="secondary"*/}
          {/*  fullWidth*/}
          {/*  className={classes.buttonStyle}*/}
          {/*>*/}
          {/*  <PublishIcon />*/}
          {/*  &nbsp;Load from File*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  variant="contained"*/}
          {/*  fullWidth*/}
          {/*  className={classes.buttonStyle}*/}
          {/*>*/}
          {/*  <PublishIcon/>*/}
          {/*  &nbsp;Export Image*/}
          {/*</Button>*/}
        </div>
      </Grid>
    </Grid>
  );
}

function ShowIf(props) {
  if (!props.condition) return null;
  return <React.Fragment>{props.children}</React.Fragment>;
}

function CloudSaveContent(props) {
  const { classes, isLoggedIn } = props;

  const spacing = isLoggedIn ? 6 : 12;

  return (
    <Grid container spacing={2}>
      <ShowIf condition={isLoggedIn}>
        <Grid classes={{ item: classes.gridItem }} item xs={spacing}>
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
          </FileBrowser>
        </Grid>
      </ShowIf>
      <Grid item classes={{ item: classes.gridItem }} xs={spacing}>
        <div className={classes.shareColumn}>
          <ShowIf condition={isLoggedIn}>
            <DescriptionBox {...props} isLocal={false} />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className={classes.buttonStyle}
            >
              <CloudUploadIcon />
              &nbsp;Upload current graph
            </Button>
            <ShareCodeBox {...props} />
          </ShowIf>
          <ShowIf condition={!isLoggedIn}>
            <Typography className={classes.loginText}>
              Your graph is automatically saved locally.
              <br />
              Sign in to Google Drive for cloud saves.
            </Typography>
          </ShowIf>
          <LoginButton {...props} />
        </div>
      </Grid>
    </Grid>

    // <div className={classes.shareColumn}>
    //   {isLoggedIn ? (

    //   ) : (
    //     <React.Fragment>

    //     </React.Fragment>
    //   )}
    //   <LoginButton {...props} />
    //   {isLoggedIn ? (
    //     <React.Fragment />
    //   ) : (
    //     <div className={classes.expand} />
    //   )}
    // </div>
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
        <Tab label="Cloud" disabled icon={<CloudIcon />} />
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

  const isLoaded = pixiJsStore.useState((s) => {
    const instance = s[pixiCanvasStateId];
    return instance?.canvasReady;
  });

  return (
    <IconDialog
      label="Save/Share"
      icon={isLoggedIn ? <CloudIcon /> : <SaveIcon />}
      disabled={!isLoaded}
    >
      <ModalOpenTrigger pixiCanvasStateId={pixiCanvasStateId} />
      <div className={classes.shareDialog}>
        {GetShareBoxContent({ isLoggedIn, classes, pixiCanvasStateId })}
      </div>
    </IconDialog>
  );
}

export default ShareButton;
