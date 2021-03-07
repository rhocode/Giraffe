import React, { useLayoutEffect } from 'react';
import { PixiJSCanvasContext } from '../../libraries/SatisGraphtoryLib/stores/GlobalGraphAppStoreProvider';
import { GlobalGraphAppStore } from '../../libraries/SatisGraphtoryLib/stores/GlobalGraphAppStore';

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
    GlobalGraphAppStore.update((s) => {
      const instance = s[usedPixiId];
      instance.openModals += 1;
    });
    return () => {
      GlobalGraphAppStore.update((s) => {
        const instance = s[usedPixiId];
        instance.openModals -= 1;
      });
    };
  }, [usedPixiId]);

  return null;
}

export default ModalOpenTrigger;
