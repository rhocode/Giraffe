import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto-condensed';

import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import configureStore from './redux/store';

import * as serviceWorker from './serviceWorker';
import { LocalizeProvider } from 'react-localize-redux';

const store = configureStore();
ReactDOM.render(
  <Provider store={store}>
    <LocalizeProvider store={store}>
      <App />
    </LocalizeProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
