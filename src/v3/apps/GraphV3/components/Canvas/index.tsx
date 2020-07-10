import React, { Suspense } from 'react';
import AutoSizedLoadingWrapper from 'common/react/AutoSizedLoadingWrapper';
import stringGen from 'v3/utils/stringGen';
import {
  generateNewPixiCanvasStore,
  pixiJsStore,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import initPixiJSCanvas from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/initPixiJSCanvas';
import { addChildren } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas';
import { Viewport } from 'pixi-viewport';
import PixiJsContextProvider from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';

const FontFaceObserver = require('fontfaceobserver');

const InnerComponent = React.lazy(() => {
  return Promise.all([
    new FontFaceObserver('Roboto Condensed').load(),
    new FontFaceObserver('Bebas Neue').load(),
  ]).then(() =>
    import(
      'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJSCanvasContainer'
    )
  );
});

type LoadableComponentProps = {
  canvasChildren: (
    app: PIXI.Application,
    viewPort: Viewport
  ) => PIXI.DisplayObject[] | undefined;
  onFinishLoad: () => void | undefined;
};

const LoadableComponent = (props: LoadableComponentProps) => {
  return (
    <Suspense fallback={<AutoSizedLoadingWrapper />}>
      <InnerComponent {...props} />
    </Suspense>
  );
};

type CanvasProps = {
  canvasChildren: (
    app: PIXI.Application,
    viewPort: Viewport
  ) => PIXI.DisplayObject[] | undefined;
  onFinishLoad: () => void | undefined;
};

function Canvas(props: CanvasProps) {
  const [pixiCanvasStateId] = React.useState(() => {
    const stateId = stringGen(10);

    pixiJsStore.update((s) => {
      s[stateId] = generateNewPixiCanvasStore();
    });

    return stateId;
  });

  const { onFinishLoad, canvasChildren } = props;

  const {
    pixiApplication,
    applicationLoaded,
    pixiViewport,
  } = pixiJsStore.useState((s) => {
    const instance = s[pixiCanvasStateId];
    return {
      pixiApplication: instance.application,
      applicationLoaded: instance.applicationLoaded,
      pixiViewport: instance.viewport,
    };
  });

  React.useEffect(() => {
    if (!applicationLoaded) return;

    initPixiJSCanvas(pixiApplication);

    const childrenToPush = canvasChildren(pixiApplication, pixiViewport);

    addChildren(childrenToPush || [], pixiCanvasStateId);
    pixiApplication.renderer.render(pixiApplication.stage);

    // Run the callback
    onFinishLoad();

    pixiJsStore.update((s) => {
      s[pixiCanvasStateId].canvasReady = true;
    });
  }, [
    applicationLoaded,
    canvasChildren,
    onFinishLoad,
    pixiApplication,
    pixiCanvasStateId,
    pixiViewport,
  ]);

  return (
    <PixiJsContextProvider pixiCanvasStateId={pixiCanvasStateId}>
      <LoadableComponent {...props} />
    </PixiJsContextProvider>
  );
}

export default Canvas;
