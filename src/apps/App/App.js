import React, { Component } from 'react';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import './App.css';

import { BrowserRouter, HashRouter, Route } from 'react-router-dom';
import { themeDark } from '../../theme';

import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';

import en from '../../translations/en.json';
import discord from '../../translations/discord.json';

import { HelmetProvider } from 'react-helmet-async';

import HeaderMessaging from '../../common/react/HeaderMessaging';
import { ApolloProvider } from 'react-apollo';
import { getClient } from '../../graphql';

const chooseLoadingStyle = importFunc => {
  if (process.env.REACT_APP_ELECTRON === 'true') {
    // Preloading enabled!
    const appPromise = importFunc();
    return React.lazy(() => appPromise);
  } else {
    return React.lazy(importFunc);
  }
};

const HomeImport = () => import('../../apps/Home/HomeApp');
const HomeApp = chooseLoadingStyle(HomeImport);

const GraphImport = () => import('../../v3/apps/GraphV3/GraphApp');
const GraphApp = chooseLoadingStyle(GraphImport);

const HubImport = () => import('../../apps/Hub/HubApp');
const HubApp = chooseLoadingStyle(HubImport);

const LabImport = () => import('../../apps/Lab/LabApp');
const LabApp = chooseLoadingStyle(LabImport);

const DataImport = () => import('../../v3/apps/DataV3/DataApp');
const DataApp = chooseLoadingStyle(DataImport);

const Router =
  process.env.REACT_APP_ELECTRON === 'true' ? HashRouter : BrowserRouter;

class DebugRouter extends Router {
  constructor(props) {
    super(props);
    console.log('initial history is: ', JSON.stringify(this.history, null, 2));
    this.history.listen((location, action) => {
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      );
      console.log(
        `The last navigation action was ${action}`,
        JSON.stringify(this.history, null, 2)
      );
    });
  }
}

const ReactRouter =
  process.env.NODE_ENV === 'production' ? Router : DebugRouter;

class AppWrapper extends Component {
  render() {
    const { children } = this.props;

    return (
      <HelmetProvider>
        <ReactRouter>
          <MuiThemeProvider theme={themeDark}>
            <React.Suspense fallback={<div>Loading...</div>}>
              <ApolloProvider client={getClient()}>{children}</ApolloProvider>
            </React.Suspense>
          </MuiThemeProvider>
        </ReactRouter>
      </HelmetProvider>
    );
  }
}

const styles = () => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'grid',
    gridTemplateAreas: `"update"
       "appBody"
       "siteFooter"`,
    gridTemplateRows: 'auto minmax(0, 1fr) auto',
    gridTemplateColumns: '1fr'
  },
  body: {
    gridArea: 'appBody',
    display: 'grid',
    gridTemplateAreas: `"body"`,
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr'
  }
});

const languages = ['en', 'discord'];

function App(props) {
  // const defaultLanguage =
  //   window.localStorage.getItem('languageCode') || languages[0];
  // window.localStorage.setItem("languageCode", curLangCode);

  const onMissingTranslation = ({ translationId, languageCode }) => {
    const text = `No Translation for ${translationId} - ${languageCode}`;
    if (process.env.NODE_ENV === 'production') {
      return translationId;
    } else {
      console.error(text);
      return text;
    }
  };

  const { initialize, addTranslationForLanguage } = props;

  const initializedHack = React.useRef(false);
  React.useEffect(() => {
    if (!initializedHack.current) {
      initializedHack.current = true;
      initialize({
        languages: [
          { name: 'English', code: 'en' },
          { name: 'Discord', code: 'discord' }
        ],

        options: {
          onMissingTranslation,
          renderToStaticMarkup,
          defaultLanguage: languages[0]
          // defaultLanguage
        }
      });

      addTranslationForLanguage(en, 'en');
      addTranslationForLanguage(discord, 'discord');
    }
  }, [addTranslationForLanguage, initialize]);

  const { classes } = props;

  return (
    <AppWrapper>
      <div id={'mainRootDiv'} className={classes.root}>
        <HeaderMessaging />
        <div className={classes.body}>{resolveDomain()}</div>
      </div>
    </AppWrapper>
  );
}

function getGraphApp(local = false) {
  return (
    <Route
      key={'graph'}
      path={local ? `/graph/:graphId?` : `/:graphId?`}
      exact={!local}
      component={GraphApp}
    />
  );
}

function getHubApp(local = false) {
  return (
    <Route
      key={'hub'}
      path={local ? `/hub` : `/`}
      exact={!local}
      component={HubApp}
    />
  );
}

function getLabApp(local = false) {
  return (
    <Route
      key={'lab'}
      path={local ? `/lab` : `/`}
      exact={!local}
      component={LabApp}
    />
  );
}

function getDataApp(local = false) {
  return (
    <Route
      key={'data'}
      path={local ? `/data` : `/`}
      exact={!local}
      component={DataApp}
    />
  );
}

function getHomeApp() {
  return <Route key={'home'} path={`/`} exact component={HomeApp} />;
}

function resolveDomain() {
  const domain = window.location.host.split('.')[1]
    ? window.location.host.split('.')[0]
    : false;
  const domainList = [];

  if (domain === 'graph') {
    domainList.push(getGraphApp());
  } else if (domain === 'hub') {
    // hub subdomain
    domainList.push(getHubApp());
  } else if (domain === 'lab') {
    // lab subdomain
    domainList.push(getLabApp());
  } else if (domain === 'data') {
    // lab subdomain
    domainList.push(getDataApp());
  } else {
    domainList.push(getHomeApp());
    domainList.push(getGraphApp(true));
    domainList.push(getLabApp(true));
    domainList.push(getHubApp(true));
    domainList.push(getDataApp(true));
  }

  return domainList;
}

export default withStyles(styles)(withLocalize(App));
