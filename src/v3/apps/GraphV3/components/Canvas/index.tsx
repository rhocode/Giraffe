import React, { Suspense } from 'react';
import AutoSizedLoadingWrapper from 'common/react/AutoSizedLoadingWrapper';
import stringGen from 'v3/utils/stringGen';
import {
  generateNewPixiCanvasStore,
  pixiJsStore,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import initPixiJSCanvas from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/initPixiJSCanvas';
import { addChildren } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas';

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
  pixiCanvasStateId: string;
};

const LoadableComponent = (props: LoadableComponentProps) => {
  return (
    <Suspense fallback={<AutoSizedLoadingWrapper />}>
      <InnerComponent {...props} />
    </Suspense>
  );
};

type CanvasProps = {
  canvasChildren: (app: PIXI.Application) => PIXI.DisplayObject[] | undefined;
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

  const pixiInstance = pixiJsStore.useState((s) => s[pixiCanvasStateId]);

  const { onFinishLoad, canvasChildren } = props;

  const pixiApplication = pixiInstance?.application;
  const applicationLoaded = pixiInstance?.applicationLoaded;

  React.useEffect(() => {
    if (!applicationLoaded) return;

    initPixiJSCanvas(pixiApplication);

    const childrenToPush = canvasChildren(pixiApplication);

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
  ]);

  return <LoadableComponent pixiCanvasStateId={pixiCanvasStateId} {...props} />;
}

export default Canvas;
