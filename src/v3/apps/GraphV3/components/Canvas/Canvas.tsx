// @refresh reset
import React, { Suspense } from 'react';
import AutoSizedLoadingWrapper from 'common/react/AutoSizedLoadingWrapper';
import PixiJsContextProvider from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
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
  initialCanvasGraph: Record<string, any> | undefined;
  onFinishLoad: () => void | undefined;
  id: string;
  dataLoaded: boolean;
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
