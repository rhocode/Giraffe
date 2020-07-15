import React from 'react';
import { removeUrlParam } from 'utils/urlUtils';
import * as serviceWorker from '../../serviceWorkerCustom';

const ServiceWorkerContext = React.createContext(null);

function ServiceWorkerProvider(props) {
  const [waitingServiceWorker, setWaitingServiceWorker] = React.useState(null);
  const [assetsUpdateReady, setAssetsUpdateReady] = React.useState(false);
  const [assetsCached, setAssetsCached] = React.useState(false);

  const value = React.useMemo(
    () => ({
      assetsUpdateReady,
      assetsCached,
      // Call when the user confirm update of application and reload page
      updateAssets: () => {
        if (waitingServiceWorker) {
          waitingServiceWorker.addEventListener('statechange', (event) => {
            if (event.target.state === 'activated') {
              window.location.reload();
            }
          });

          waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        } else {
          window.location.reload();
        }
      },
    }),
    [assetsUpdateReady, assetsCached, waitingServiceWorker]
  );

  // Once on component mounted subscribe to Update and Succes events in
  // CRA's service worker wrapper.
  React.useEffect(() => {
    if (
      navigator?.userAgent?.indexOf(
        '(+https://github.com/prerender/prerender)'
      ) === -1
    ) {
      serviceWorker.register({
        onUpdate: (registration) => {
          setWaitingServiceWorker(registration.waiting);
          setAssetsUpdateReady(true);
        },
        onSuccess: () => {
          setAssetsCached(true);
        },
      });
    }
  });

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refreshKeyword = 'forceUpdate';
    if (urlParams.get(refreshKeyword) === '') {
      const newUrl = removeUrlParam(refreshKeyword, window.location.href);
      window.history.replaceState({}, document.title, newUrl);
      setAssetsUpdateReady(true);
    }
  }, [setAssetsUpdateReady]);

  return <ServiceWorkerContext.Provider value={value} {...props} />;
}

export function useServiceWorker() {
  const context = React.useContext(ServiceWorkerContext);

  if (!context) {
    throw new Error(
      'useServiceWorker must be used within a ServiceWorkerProvider'
    );
  }

  return context;
}

// const mapStateToProps = () => ({});
//
// const mapDispatchToProps = dispatch => ({
//   setUpdateAvailable: data => dispatch(setUpdateAvailable(data))
// });

export default ServiceWorkerProvider;
// connect(
//   mapStateToProps,
//   mapDispatchToProps
// )();
