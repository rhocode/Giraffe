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
import { importImageManifest } from 'v3/data/loaders/sgImageRepo';
import { useThemeProvider } from 'common/react/SGThemeProvider';
import { GraphObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
// import {Store} from "pullstate";

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

type LoadableComponentProps = {
  initialCanvasChildren: (
    app: PIXI.Application,
    viewPort: Viewport,
    translate: Function,
    theme: Record<string, any>
  ) => NodeTemplate[] | undefined;
  onFinishLoad: () => void | undefined;
};

const LoadablePixiComponent = (props: LoadableComponentProps) => {
  // const [progressStore] = React.useState(new Store({
  //   progress: 0,
  //   totalProgress: 0
  // }));

  // const incrementStore = React.useCallback(() => {
  //   progressStore.update(s => {
  //     s.progress += 1;
  //   })
  // }, [progressStore])
  //
  // const addTotalProgress = React.useCallback(() => {
  //   progressStore.update(s => {
  //     s.progress += 1;
  //   })
  // }, [progressStore])

  return (
    <Suspense fallback={<AutoSizedLoadingWrapper />}>
      <InnerComponent {...props} />
    </Suspense>
  );
};

type CanvasProps = {
  initialCanvasChildren: (
    app: PIXI.Application,
    viewPort: Viewport,
    translate: Function,
    theme: Record<string, any>
  ) => NodeTemplate[] | undefined;
  onFinishLoad: () => void | undefined;
};

function Canvas(props: CanvasProps) {
  const [pixiCanvasStateId] = React.useState(() => {
    return uuidGen();
  });

  React.useEffect(() => {
    pixiJsStore.update((s) => {
      if (!s[pixiCanvasStateId]) {
        console.log('Store was updated');
        s[pixiCanvasStateId] = generateNewPixiCanvasStore();
      }
    });
  }, [pixiCanvasStateId]);

  const { onFinishLoad, initialCanvasChildren } = props;

  const {
    pixiApplication,
    applicationLoaded,
    pixiViewport,
    canvasReady,
  } = pixiJsStore.useState((s) => {
    const instance = s[pixiCanvasStateId];
    return {
      pixiApplication: instance?.application,
      applicationLoaded: instance?.applicationLoaded,
      pixiViewport: instance?.viewport,
      canvasReady: instance?.canvasReady,
    };
  });

  const { translate } = React.useContext(LocaleContext);

  const theme = useThemeProvider();

  // Update the theme for each child
  React.useEffect(() => {
    if (!applicationLoaded) return;

    // loadSharedTextures(pixiApplication.renderer, theme)
    pixiJsStore.update((t) => {
      const s = t[pixiCanvasStateId];

      for (const child of s.children) {
        if (child instanceof GraphObject) {
          child.updateTheme(theme);
        }
      }
    });
  }, [applicationLoaded, pixiApplication, pixiCanvasStateId, theme]);

  React.useEffect(() => {
    if (!applicationLoaded) return;

    if (canvasReady) return;

    initPixiJSCanvas(pixiApplication, theme);

    const childrenToPush = initialCanvasChildren(
      pixiApplication,
      pixiViewport,
      translate,
      theme
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
    canvasReady,
    initialCanvasChildren,
    onFinishLoad,
    pixiApplication,
    pixiCanvasStateId,
    pixiViewport,
    theme,
    translate,
  ]);

  return (
    <PixiJsContextProvider pixiCanvasStateId={pixiCanvasStateId}>
      <LoadablePixiComponent {...props} />
    </PixiJsContextProvider>
  );
}

export default Canvas;
