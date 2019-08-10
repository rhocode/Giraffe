import React from 'react';
import ReactDOM from 'react-dom';
import App from './apps/App/App';
import { LocalizeProvider } from 'react-localize-redux';
import { Provider } from 'react-redux';
import getStore from './redux/store';
import ServiceWorkerProvider from './common/react/ServiceWorkerProvider';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = getStore();
  ReactDOM.render(
    <Provider store={store}>
      <ServiceWorkerProvider>
        <LocalizeProvider store={store}>
          <App />
        </LocalizeProvider>
      </ServiceWorkerProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
