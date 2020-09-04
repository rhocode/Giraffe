import React, { useLayoutEffect } from 'react';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';

function ModalOpenTrigger() {
  const { pixiCanvasStateId } = React.useContext(PixiJSCanvasContext);

  useLayoutEffect(() => {
    pixiJsStore.update((s) => {
      const instance = s[pixiCanvasStateId];
      instance.openModals += 1;
    });
    return () => {
      pixiJsStore.update((s) => {
        const instance = s[pixiCanvasStateId];
        instance.openModals -= 1;
      });
    };
  }, [pixiCanvasStateId]);

  return null;
}

export default ModalOpenTrigger;
