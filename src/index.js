import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './apps/App/App';

import { Provider } from 'react-redux';
import configureStore from './redux/store';

import { LocalizeProvider } from 'react-localize-redux';
import ServiceWorkerProvider from "./common/react/ServiceWorkerProvider";
require('typeface-roboto-condensed');

const store = configureStore();
ReactDOM.render(
  <ServiceWorkerProvider>
    <Provider store={store}>
      <LocalizeProvider store={store}>
        <App />
      </LocalizeProvider>
    </Provider>
  </ServiceWorkerProvider>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// useServiceWorker();
// serviceWorker.register();
