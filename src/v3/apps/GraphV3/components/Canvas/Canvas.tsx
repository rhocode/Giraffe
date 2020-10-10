// @refresh reset
import React, { Suspense } from 'react';
import AutoSizedLoadingWrapper from 'common/react/AutoSizedLoadingWrapper';
import { Viewport } from 'pixi-viewport';
import PixiJsContextProvider from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { importImageManifest } from 'v3/data/loaders/sgImageRepo';

const FontFaceObserver = require('fontfaceobserver');

const InnerComponent = React.lazy(() => {
  return Promise.all([
    new FontFaceObserver('Roboto Condensed', { weight: 400 }).load(),
    new FontFaceObserver('Bebas Neue', { weight: 400 }).load(),
    new FontFaceObserver('Roboto Slab', { weight: 400 }).load(),
    importImageManifest(),
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

type CanvasProps = {
  initialCanvasChildren: (
    app: PIXI.Application,
    viewPort: Viewport,
    translate: Function,
    theme: Record<string, any>
  ) => NodeTemplate[] | undefined;
  onFinishLoad: () => void | undefined;
  id: string;
};

function Canvas(props: CanvasProps) {
  return (
    <PixiJsContextProvider pixiCanvasStateId={props.id}>
      <Suspense fallback={<AutoSizedLoadingWrapper />}>
        <InnerComponent {...props} />
      </Suspense>
    </PixiJsContextProvider>
  );
}

export default Canvas;
