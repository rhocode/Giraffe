import SGErrorBoundary from 'common/react/ErrorBoundary';
import React from 'react';
import ReactDOM from 'react-dom';
import LocaleProvider from 'v3/components/LocaleProvider';
import App from './apps/App/App';
import { LocalizeProvider } from 'react-localize-redux';
import { Provider } from 'react-redux';
import getStore from './redux/store';
import ServiceWorkerProvider from './common/react/ServiceWorkerProvider';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = getStore();
  ReactDOM.render(
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
    </ServiceWorkerProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
