import React, { Component } from 'react';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import './App.css';

import { BrowserRouter, HashRouter, Route } from 'react-router-dom';
import { themeDark } from '../../theme';

import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';

import en from '../../translations/en.json';
import AsyncComponent from '../../common/react/AsyncComponent';
import HomeApp from '../../apps/Home/HomeApp';
import HeaderMessaging from '../../common/react/HeaderMessaging';
import { ApolloProvider } from 'react-apollo';
import { getClient } from '../../graphql';

const GraphApp = AsyncComponent(import('../../apps/Graph/GraphApp'));
const HubApp = AsyncComponent(import('../../apps/Hub/HubApp'));
const LabApp = AsyncComponent(import('../../apps/Lab/LabApp'));

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

// const ReactRouter = process.env.NODE_ENV === 'production' ? Router : DebugRouter;
const ReactRouter =
  process.env.NODE_ENV === 'production' ? DebugRouter : DebugRouter;

class AppWrapper extends Component {
  render() {
    const { children } = this.props;

    return (
      <ReactRouter>
        <MuiThemeProvider theme={themeDark}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <ApolloProvider client={getClient()}>{children}</ApolloProvider>
          </React.Suspense>
        </MuiThemeProvider>
      </ReactRouter>
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

class App extends Component {
  constructor(props) {
    super(props);

    const languages = ['en'];
    const defaultLanguage =
      window.localStorage.getItem('languageCode') || languages[0];
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

    this.props.initialize({
      languages: [{ name: 'English', code: 'en' }],

      options: {
        onMissingTranslation,
        renderToStaticMarkup,
        defaultLanguage
      }
    });

    props.addTranslationForLanguage(en, 'en');
  }

  static getGraphApp(local = false) {
    console.error(`/graph/:graphId?`, local);
    return (
      <Route
        key={'graph'}
        path={local ? `/graph/:graphId?` : `/:graphId?`}
        exact={!local}
        component={GraphApp}
      />
    );
  }

  static getHubApp(local = false) {
    return (
      <Route
        key={'hub'}
        path={local ? `/hub` : `/`}
        exact={!local}
        component={HubApp}
      />
    );
  }

  static getLabApp(local = false) {
    return (
      <Route
        key={'lab'}
        path={local ? `/lab` : `/`}
        exact={!local}
        component={LabApp}
      />
    );
  }

  static getHomeApp() {
    return <Route key={'home'} path={`/`} exact component={HomeApp} />;
  }

  static resolveDomain() {
    const domain = window.location.host.split('.')[1]
      ? window.location.host.split('.')[0]
      : false;
    const domainList = [];

    if (domain === 'graph') {
      domainList.push(App.getGraphApp());
    } else if (domain === 'hub') {
      // hub subdomain
      domainList.push(App.getHubApp());
    } else if (domain === 'lab') {
      // lab subdomain
      domainList.push(App.getLabApp());
    } else {
      domainList.push(App.getHomeApp());
      domainList.push(App.getGraphApp(true));
      domainList.push(App.getLabApp(true));
      domainList.push(App.getHubApp(true));
    }

    return domainList;
  }

  render() {
    const { classes } = this.props;
    return (
      <AppWrapper>
        <div id={'mainRootDiv'} className={classes.root}>
          <HeaderMessaging />
          <div className={classes.body}>{App.resolveDomain()}</div>
        </div>
      </AppWrapper>
    );
  }
}

export default withStyles(styles)(withLocalize(App));
