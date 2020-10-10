import 'development/wdyr';

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
// Flat polyfill
import 'core-js/features/array/flat';
import './index.css';

import 'reflect-metadata';
import { enableMapSet } from 'immer';
import React from 'react';
import { render } from 'react-dom';
import { LocalizeProvider } from 'react-localize-redux';
import { Provider } from 'react-redux';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import LocaleProvider from 'v3/components/LocaleProvider';

import App from './apps/App/App';
import ServiceWorkerProvider from './common/react/ServiceWorkerProvider';
import getStore from './redux/store';
import SGErrorBoundary from 'common/react/ErrorBoundary';

import './fonts/BebasNeue-Regular.ttf';
require('fontsource-roboto-condensed');
require('fontsource-roboto-mono');
require('fontsource-roboto-slab');

enableMapSet();
PIXI.utils.skipHello();

const store = getStore();

const CompleteApp = () => {
  return (
    <ServiceWorkerProvider>
      <SGErrorBoundary>
        <Provider store={store}>
          <LocalizeProvider store={store}>
            <LocaleProvider>
              <App />
            </LocaleProvider>
          </LocalizeProvider>
        </Provider>
      </SGErrorBoundary>
    </ServiceWorkerProvider>
  );
};

const rootElement = document.getElementById('root');

render(<CompleteApp />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// useServiceWorker();
// serviceWorker.register();
