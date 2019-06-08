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

  render() {
    return (
      <Router>
        <MuiThemeProvider theme={themeDark}>
          <Route path="/" exact component={GraphApp} />
          <Route path="/lab" exact component={LabApp} />
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default withLocalize(App);
