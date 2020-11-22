import React, { useLayoutEffect } from 'react';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';

type ModalOpenTriggerProps = {
  pixiCanvasStateId?: string;
};

function ModalOpenTrigger(props: ModalOpenTriggerProps) {
  const { pixiCanvasStateId } = React.useContext(PixiJSCanvasContext);

  const propProvidedPixiCanvasStateId = props.pixiCanvasStateId;

  const usedPixiId = pixiCanvasStateId
    ? pixiCanvasStateId
    : (propProvidedPixiCanvasStateId as string);

  useLayoutEffect(() => {
    pixiJsStore.update((s) => {
      const instance = s[usedPixiId];
      instance.openModals += 1;
    });
    return () => {
      pixiJsStore.update((s) => {
        const instance = s[usedPixiId];
        instance.openModals -= 1;
      });
    };
  }, [usedPixiId]);

  return null;
}

export default ModalOpenTrigger;
