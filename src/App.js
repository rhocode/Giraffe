import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { themeDark } from './theme';
// import LabApp from './apps/Lab/LabApp';

import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';

import en from './translations/en.json';
import AsyncComponent from "./common/react/AsyncComponent";
import HomeApp from "./apps/Home/HomeApp";

const GraphApp = AsyncComponent(import('./apps/Graph/GraphApp'));
const HubApp = AsyncComponent(import('./apps/Hub/HubApp'));
const LabApp = AsyncComponent(import('./apps/Lab/LabApp'));


class DebugRouter extends Router {
  constructor(props){
    super(props);
    console.log('initial history is: ', JSON.stringify(this.history, null,2))
    this.history.listen((location, action)=>{
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      );
      console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null,2));
    });
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    const languages = ['en'];
    const defaultLanguage =
      window.localStorage.getItem('languageCode') || languages[0];
    // window.localStorage.setItem("languageCode", curLangCode);

    this.props.initialize({
      languages: [{ name: 'English', code: 'en' }],

      options: {
        renderToStaticMarkup,
        defaultLanguage
      }
    });

    props.addTranslationForLanguage(en, 'en');
  }

  static getGraphApp(local = false) {
    return <Route key={'graph'} path={local ? '/graph/:graphId?' : '/:graphId?'} exact={!local} component={GraphApp} />
  }

  static getHubApp(local = false) {
    return <Route key={'hub'} path={local ? '/hub' : '/'} exact={!local} component={HubApp} />
  }

  static getLabApp(local = false) {
    return <Route key={'lab'} path={local ? '/lab' : '/'} exact={!local} component={LabApp} />
  }

  static getHomeApp() {
    return <Route key={'lab'} path='/' exact component={HomeApp} />
  }


  static resolveDomain() {
    const domain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
    const domainList = [];
    console.log(domain)

    if(domain === 'graph') {
      domainList.push(App.getGraphApp());
    } else if(domain === 'hub') {
      // hub subdomain
      domainList.push(App.getHubApp());
    } else if(domain === 'lab') {
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

    return (
      <DebugRouter>
        <MuiThemeProvider theme={themeDark}>
          <React.Suspense fallback={<div>Loading...</div>}>
          {
            App.resolveDomain()
          }
          </React.Suspense>
        </MuiThemeProvider>
      </DebugRouter>
    );
  }
}

export default withLocalize(App);
