import React from 'react';
import {
  GlobalGraphAppStore,
  initialGraphAppStateId,
} from './GlobalGraphAppStore';

export const PixiJSCanvasContext = React.createContext({
  pixiCanvasStateId: '',
});

function GlobalGraphAppStoreProvider(props: any) {
  const [currentStateId, setCurrentStateId] = React.useState(
    initialGraphAppStateId
  );

  const storeValues = GlobalGraphAppStore.useState((s) => {
    const instance = s[currentStateId];
    return {
      ...instance,
      pixiCanvasStateId: currentStateId,
      pixiRenderer: instance?.application?.renderer,
      setCurrentStateId: (newId: string) => setCurrentStateId(newId),
    };
  });

  return (
    <PixiJSCanvasContext.Provider value={{ ...storeValues }}>
      {props.children}
    </PixiJSCanvasContext.Provider>
  );
}

export default GlobalGraphAppStoreProvider;
