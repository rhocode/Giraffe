import React from "react";
import { pixiJsStore } from "v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore";

export const PixiJSCanvasContext = React.createContext();

function PixiJsContextProvider(props) {
  const { pixiCanvasStateId } = props;

  const storeValues = pixiJsStore.useState((s) => {
    const instance = s[pixiCanvasStateId];
    return {
      pixiCanvasStateId: pixiCanvasStateId,
      application: instance.application,
      mouseState: instance.mouseState,
      pixiViewport: instance.viewport,
      pixiRenderer: instance?.application?.renderer,
      canvasReady: instance?.canvasReady,
      viewportChildContainer: instance.viewportChildContainer,
    };
  });

  return (
    <PixiJSCanvasContext.Provider value={{ ...storeValues }}>
      {props.children}
    </PixiJSCanvasContext.Provider>
  );
}

export default PixiJsContextProvider;
