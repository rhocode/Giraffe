import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import GraphApp from './apps/Graph/GraphApp';
import { themeDark } from './theme';
import LabApp from './apps/Lab/LabApp';

import { renderToStaticMarkup } from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';

import en from './translations/en.json';

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
    // TODO: Replace / with /graph subdomain
    return <Route key={'graph'} path={local ? '/' : '/'} exact component={GraphApp} />
  }

  static getLabApp(local = false) {
    return <Route key={'lab'} path={local ? '/lab' : '/'} exact component={LabApp} />
  }

  resolveDomain() {
    const domain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
    const domainList = [];
    console.log(domain);
    if (domain === 'www' || domain === 'graph') {
      // main domain
      domainList.push(App.getGraphApp());
    } else if(domain === 'lab') {
      // lab subdomain
      domainList.push(App.getLabApp());
    } else {
      domainList.push(App.getGraphApp(true));
      domainList.push(App.getLabApp(true));
    }

    return domainList;
  }

  render() {

    return (
      <Router>
        <MuiThemeProvider theme={themeDark}>
          {
            this.resolveDomain()
          }
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default withLocalize(App);
