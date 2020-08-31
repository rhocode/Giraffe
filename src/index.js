import 'development/wdyr';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
// Flat polyfill
import 'core-js/features/array/flat';
import './index.css';
import 'reflect-metadata';
import './fonts/BebasNeue-Regular.ttf';

import SGErrorBoundary from 'common/react/ErrorBoundary';
import {enableMapSet} from 'immer';
import React from 'react';
import {render} from 'react-dom';
import {LocalizeProvider} from 'react-localize-redux';
import {Provider} from 'react-redux';
import PIXI from
    'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import LocaleProvider from 'v3/components/LocaleProvider';

import App from './apps/App/App';
import ServiceWorkerProvider from './common/react/ServiceWorkerProvider';
import getStore from './redux/store';

require('typeface-roboto-condensed');
require('typeface-roboto-mono');
require('typeface-roboto-slab');

enableMapSet();
PIXI.utils.skipHello();

const store = getStore();

const CompleteApp = () => {
  return (
    <SGErrorBoundary>
      <Provider store={store}>
        <LocalizeProvider store={store}>
          <LocaleProvider>
            <ServiceWorkerProvider>
              <App />
            </ServiceWorkerProvider>
          </LocaleProvider>
        </LocalizeProvider>
      </Provider>
    </SGErrorBoundary>
  );
};

const rootElement = document.getElementById('root');

render(<CompleteApp />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// useServiceWorker();
// serviceWorker.register();
