import React from 'react';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';

export const PixiJSCanvasContext = React.createContext({
  pixiCanvasStateId: '',
});

function PixiJsContextProvider(props) {
  const { pixiCanvasStateId } = props;

  const storeValues = pixiJsStore.useState((s) => {
    const instance = s[pixiCanvasStateId];
    return {
      ...instance,
      pixiCanvasStateId: pixiCanvasStateId,
      rawInstance: instance,
      pixiViewport: instance?.viewport,
      pixiRenderer: instance?.application?.renderer,

      // application: instance?.application,
      // mouseState: instance?.mouseState,
      // canvasReady: instance?.canvasReady,
      // viewportChildContainer: instance?.viewportChildContainer,
      // children: instance?.children,
      // childrenMap: instance?.childrenMap,
      // applicationLoaded: instance?.applicationLoaded,
      // aliasCanvasObjects: instance?.aliasCanvasObjects,
      // eventEmitter: instance?.eventEmitter,
      // triggerUpdate: instance?.triggerUpdate,
      // selectedMachine: instance?.selectedMachine,
      // selectedRecipe: instance?.selectedRecipe,
      // openModals: instance?.openModals,
    };
  });

  return (
    <PixiJSCanvasContext.Provider value={{ ...storeValues }}>
      {props.children}
    </PixiJSCanvasContext.Provider>
  );
}

export default PixiJsContextProvider;
