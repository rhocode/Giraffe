import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
// Flat polyfill
import "core-js/features/array/flat";
import "./index.css";
import "./fonts/BebasNeue-Regular.ttf";
import "reflect-metadata";

import * as Sentry from "@sentry/react";
import { enableMapSet } from "immer";
import React from "react";
import { render } from "react-dom";
import { LocalizeProvider } from "react-localize-redux";
import { Provider } from "react-redux";
import PIXI from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider";

import App from "./apps/App/App";
import ServiceWorkerProvider from "./common/react/ServiceWorkerProvider";
import getStore from "./redux/store";

require("typeface-roboto-condensed");
require("typeface-roboto-mono");
enableMapSet();
PIXI.utils.skipHello();

const store = getStore();

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn:
      "https://a1b8cacbf80d4d16afce2fb9cd39db2f@o416463.ingest.sentry.io/5311573",
  });
}

const CompleteApp = () => {
  return (
    <Provider store={store}>
      <ServiceWorkerProvider>
        <LocalizeProvider store={store}>
          <App />
        </LocalizeProvider>
      </ServiceWorkerProvider>
    </Provider>
  );
};

const rootElement = document.getElementById("root");

render(<CompleteApp />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// useServiceWorker();
// serviceWorker.register();
