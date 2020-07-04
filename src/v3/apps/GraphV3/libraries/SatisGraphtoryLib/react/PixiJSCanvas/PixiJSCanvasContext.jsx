import React from 'react';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';

export const CanvasContext = React.createContext();

function CanvasProvider(props) {
  const application = pixiJsStore.useState((s) => s.application);
  return (
    <CanvasContext.Provider value={{ application }}>
      {props.children}
    </CanvasContext.Provider>
  );
}

export default CanvasProvider;
