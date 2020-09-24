import React, { Suspense } from 'react';
import AutoSizedLoadingWrapper from 'common/react/AutoSizedLoadingWrapper';
import uuidGen from 'v3/utils/stringUtils';
import {
  generateNewPixiCanvasStore,
  pixiJsStore,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import initPixiJSCanvas from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/initPixiJSCanvas';
import { addObjectChildren } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas/childrenApi';
import { Viewport } from 'pixi-viewport';
import PixiJsContextProvider from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { LocaleContext } from 'v3/components/LocaleProvider';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import {importImageManifest} from "v3/data/loaders/sgImageRepo";

const FontFaceObserver = require('fontfaceobserver');

const InnerComponent = React.lazy(() => {
  return Promise.all([
    new FontFaceObserver('Roboto Condensed', { weight: 400 }).load(),
    new FontFaceObserver('Bebas Neue', { weight: 400 }).load(),
    new FontFaceObserver('Roboto Slab', { weight: 400 }).load(),
    importImageManifest()
  ])
    .catch(() => {
      // Prerenderer isn't happy about us blocking on load
      return import(
        'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJSCanvasContainer'
      );
    })
    .then(
      () =>
        import(
          'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJSCanvasContainer'
        )
    );
});

type LoadableComponentProps = {
  canvasChildren: (
    app: PIXI.Application,
    viewPort: Viewport,
    translate: Function
  ) => NodeTemplate[] | undefined;
  onFinishLoad: () => void | undefined;
};

const LoadablePixiComponent = (props: LoadableComponentProps) => {
  return (
    <Suspense fallback={<AutoSizedLoadingWrapper />}>
      <InnerComponent {...props} />
    </Suspense>
  );
};

type CanvasProps = {
  canvasChildren: (
    app: PIXI.Application,
    viewPort: Viewport,
    translate: Function
  ) => NodeTemplate[] | undefined;
  onFinishLoad: () => void | undefined;
};

function Canvas(props: CanvasProps) {
  const [pixiCanvasStateId] = React.useState(() => {
    const stateId = uuidGen();

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

  const { translate } = React.useContext(LocaleContext);

  React.useEffect(() => {
    if (!applicationLoaded) return;

    initPixiJSCanvas(pixiApplication);

    const childrenToPush = canvasChildren(
      pixiApplication,
      pixiViewport,
      translate
    );

    addObjectChildren(childrenToPush || [], pixiCanvasStateId);
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
    translate,
  ]);

  return (
    <PixiJsContextProvider pixiCanvasStateId={pixiCanvasStateId}>
      <LoadablePixiComponent {...props} />
    </PixiJsContextProvider>
  );
}

export default Canvas;
