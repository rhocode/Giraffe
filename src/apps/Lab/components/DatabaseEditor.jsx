import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import firebaseApp, {
  firebaseGithubAuth
} from '../../../common/firebase/firebaseApp';
import firebaseFirestore from '../../../common/firebase/firebaseFirestore';

import dataLoader from '../libraries/SGDataLib/utils/dataLoader';
import {
  getTables,
  tableMapping
} from '../libraries/SGDataLib/constants/tableConstants';
import { Translate, withLocalize } from 'react-localize-redux';
import FormRenderer from '../libraries/SGDataLib/react/FormRenderer';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import AddRowModal from './AddRowModal';
import RemoveRowModal from './RemoveRowModal';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

function TabContainer(props) {
  return <div className={props.classes.tabContainer}>{props.children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => {
  return {
    root: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexDirection: 'column'
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(4)
    },
    fabDownload: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(20)
    },
    fabSyncFromGdoc: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(12)
    },
    leftSelect: {
      position: 'absolute',
      bottom: theme.spacing(2),
      left: theme.spacing(4)
    },
    errorSnackbar: {
      backgroundColor: theme.palette.error.dark
    },
    header: {
      height: 48,
      flex: 0
    },
    tabContainerDiv: {
      flex: 1,
      overflowX: 'hidden',
      overflowY: 'auto',
      display: 'flex'
    },
    tabContainer: {
      flex: 1,
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-evenly'
    },
    formControl: {
      width: 200
    },
    githubSignIn: {
      height: 70,
      margin: 20,
      paddingLeft: 20,
      paddingRight: 20
    }
  };
};

class DatabaseEditor extends Component {
  state = {
    value: 0,
    serverData: {},
    snackbarOpen: false,
    errorMessage: '',
    addItemModalOpen: false,
    removeItemModalOpen: false,
    deletionFunction: () => {},
    deletionName: '',
    versions: ['Loading...'],
    selectedVersion: -1,
    loggedIn: false
  };

  handleChange = (event, newValue) => {
    if (this.state.value !== newValue) {
      this.setState({ value: newValue });
    }
  };

  componentDidMount() {
    const thisAccessor = this;

    firebaseApp.auth().onAuthStateChanged(function(user) {
      if (user) {
        thisAccessor.setState({ loggedIn: true });
        dataLoader(
          getTables,
          firebaseFirestore,
          tableMapping,
          function(tableName, tableData) {
            const pathArray = tableName.split('/');
            const lastTableName = pathArray[pathArray.length - 1];

            thisAccessor.setState({
              tabPaths: {
                ...thisAccessor.state.tabPaths,
                [lastTableName]: tableName
              },
              serverData: {
                ...thisAccessor.state.serverData,
                [lastTableName]: tableData
              }
            });
          },
          versions => {
            let selectedVersion = thisAccessor.state.selectedVersion;

            if (selectedVersion === -1) {
              selectedVersion = versions[0];
            }
            thisAccessor.setState({ versions, selectedVersion });
          }
        );
      }
    });
  }

  handleVersionChange = event => {
    if (event.target.value !== this.state.selectedVersion) {
      this.setState({ selectedVersion: event.target.value });
    }
  };

  addItem = (type, path) => {
    return (dummy = null, name = null) => {
      return new type().initialize(path, firebaseFirestore, name);
    };
  };

  handleAddItemModalOpen = () => {
    this.setState({ addItemModalOpen: true });
  };

  handleAddItemModalClose = () => {
    this.setState({ addItemModalOpen: false });
  };

  handleRemoveItemModalOpen = (deletionFunction, deletionName) => {
    return () => {
      this.setState({
        removeItemModalOpen: true,
        deletionFunction,
        deletionName
      });
    };
  };

  handleRemoveItemModalClose = () => {
    this.setState({ removeItemModalOpen: false });
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  loginWithGithub = () => {
    firebaseGithubAuth().then(function(result) {
      // // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      // var token = result.credential.accessToken;
      // // The signed-in user info.
      // var user = result.user;
      // // ...
    });
  };

  render() {
    const { classes } = this.props;
    const {
      value,
      snackbarOpen,
      addItemModalOpen,
      removeItemModalOpen
    } = this.state;

    let tabKeys = Object.keys(this.state.serverData).sort().reverse();
    let serverData = [];
    let selectedTab = 0;
    let objectBaseType = null;
    let objectPath = null;
    let generatedDocId = false;
    let blacklistedEntries = [];

    if (tabKeys.length === 0) {
      tabKeys = ['Loading...'];
    } else {
      //
      selectedTab = tabKeys[value % tabKeys.length];
      serverData = this.state.serverData[selectedTab];
      objectBaseType = tableMapping[selectedTab];

      objectPath = this.state.tabPaths[selectedTab];
      generatedDocId = !new objectBaseType().useIdentifierAsDocumentName();
      if (!generatedDocId) {
        blacklistedEntries = serverData.map(item => item.id);
      }
    }


    return (
      <div className={classes.root}>
        <AddRowModal
          blackList={blacklistedEntries}
          open={addItemModalOpen}
          handleClose={this.handleAddItemModalClose}
          addItemAction={this.addItem(objectBaseType, objectPath)}
        />
        <RemoveRowModal
          open={removeItemModalOpen}
          handleClose={this.handleRemoveItemModalClose}
          clickFunction={this.state.deletionFunction}
          name={this.state.deletionName}
        />
        <AppBar className={classes.header} position="static">
          <Tabs
            value={value}
            onChange={this.handleChange}
            variant="scrollable"
            scrollButtons="off"
          >
            {tabKeys.map(key => {
              return <Tab label={key} key={key} />;
            })}
          </Tabs>
        </AppBar>
        <div className={classes.tabContainerDiv}>
          <TabContainer classes={classes}>
            {!this.state.loggedIn ? (
              <Button
                className={classes.githubSignIn}
                onClick={this.loginWithGithub}
              >
                Sign in with GitHub
              </Button>
            ) : null}
            {serverData.map(({ id, data }) => {
              return (
                <FormRenderer
                  openDeletion={this.handleRemoveItemModalOpen}
                  table={selectedTab}
                  key={id}
                  renderedItem={data}
                  autoCompleteData={this.state.serverData}
                />
              );
            })}
          </TabContainer>
        </div>
        <Fab
          hidden={!!objectPath}
          className={classes.fab}
          color={'primary'}
          onClick={
            generatedDocId
              ? this.addItem(objectBaseType, objectPath)
              : this.handleAddItemModalOpen
          }
        >
          <AddIcon />
        </Fab>
        <Fab
          hidden={!!objectPath}
          className={classes.fabSyncFromGdoc}
          color={'primary'}
          onClick={() => new objectBaseType().import(objectPath)}
        >
          <CloudUploadIcon />
        </Fab>
        <Fab
          hidden={!!objectPath}
          className={classes.fabDownload}
          color={'primary'}
          onClick={
            () => new objectBaseType().downloadDataToProto(objectPath)
          }
        >
          <CloudDownloadIcon />
        </Fab>
        <div className={classes.leftSelect} color={'primary'}>
          <FormControl>
            <InputLabel htmlFor="version-helper">Version</InputLabel>
            <Select
              value={this.state.selectedVersion}
              onChange={this.handleVersionChange}
              className={classes.formControl}
              input={<Input name="version" id="version-helper" />}
            >
              {this.state.versions.length === -1 ? (
                <MenuItem value={-1}>
                  <em>
                    <Translate id="greeting" />
                  </em>
                </MenuItem>
              ) : null}
              {this.state.versions.map(version => {
                return (
                  <MenuItem key={version} value={version}>
                    {version}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
        >
          <SnackbarContent
            className={classes.errorSnackbar}
            message={<span id="message-id">{this.state.errorMessage} </span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleSnackbarClose}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </Snackbar>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default withLocalize(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(DatabaseEditor))
);
