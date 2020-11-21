import gapi from 'gapi-client';
import { Store } from 'pullstate';
import React from 'react';

export const GoogleApiContext = React.createContext({
  loggedIn: false,
});

const googleAuthStore = new Store({
  isLoggedIn: false,
  authInstance: null,
});

const CLIENT_ID = process.env.REACT_APP_GCLOUD_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GCLOUD_API_KEY;

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export default function GoogleAuthProvider(props) {
  const { isLoggedIn, authInstance } = googleAuthStore.useState((s) => ({
    isLoggedIn: s.isLoggedIn,
    authInstance: s.authInstance,
  }));

  const login = React.useCallback(() => {
    authInstance.signIn();
  }, [authInstance]);

  const logout = React.useCallback(() => {
    authInstance.signOut();
  }, [authInstance]);

  const init = React.useCallback(() => {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(function () {
          googleAuthStore.update((s) => {
            s.isLoggedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
            s.authInstance = gapi.auth2.getAuthInstance();
          });
          gapi.auth2.getAuthInstance().isSignedIn.listen((status) => {
            googleAuthStore.update((s) => {
              s.isLoggedIn = status;
            });
          });
        });
    });
  }, []);

  return (
    <GoogleApiContext.Provider value={{ init, isLoggedIn, login, logout }}>
      {props.children}
    </GoogleApiContext.Provider>
  );
}
