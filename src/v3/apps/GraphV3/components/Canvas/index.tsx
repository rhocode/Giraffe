import React, { Suspense } from 'react';
import AutoSizedLoadingWrapper from 'common/react/AutoSizedLoadingWrapper';
import stringGen from 'v3/utils/stringGen';
import {
  generateNewPixiCanvasStore,
  pixiJsStore,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import initPixiJSCanvas from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/initPixiJSCanvas';
import { addObjectChildren } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas';
import { Viewport } from 'pixi-viewport';
import PixiJsContextProvider from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { LocaleContext } from 'v3/components/LocaleProvider';
import { arraysEqual } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/utils/arrayUtils';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import AdvancedNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/AdvancedNode';
import MouseState from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/enums/MouseState';

const FontFaceObserver = require('fontfaceobserver');

const InnerComponent = React.lazy(() => {
  return Promise.all([
    new FontFaceObserver('Roboto Condensed').load(),
    new FontFaceObserver('Bebas Neue').load(),
    new FontFaceObserver('Roboto Slab').load(),
  ]).then(() =>
    import(
      'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJSCanvasContainer'
    )
  );
});

type LoadableComponentProps = {
  canvasChildren: (
    app: PIXI.Application,
    viewPort: Viewport,
    translate: Function,
    onSelectNodes: (nodeIds: string[]) => any
  ) => NodeTemplate[] | undefined;
  onFinishLoad: () => void | undefined;
  onSelectNodes: (nodeIds: string[]) => any;
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
    viewPort: Viewport,
    translate: Function,
    onSelectNodes: (nodeIds: string[]) => any
  ) => NodeTemplate[] | undefined;
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

  const { translate } = React.useContext(LocaleContext);

  const onSelectNodes = React.useCallback(
    (nodeIds: string[]) => {
      pixiJsStore.update((sParent) => {
        const s = sParent[pixiCanvasStateId];

        if (s.mouseState !== MouseState.SELECT) return;

        for (const child of s.children.values()) {
          if (child instanceof AdvancedNode) {
            (child as AdvancedNode).container.highLight.visible = false;
          }
        }

        const selected = nodeIds.map((nodeId) => {
          const retrievedNode = s.children.get(nodeId);
          if (retrievedNode instanceof AdvancedNode) {
            (retrievedNode as AdvancedNode).container.highLight.visible = true;
          }
          return retrievedNode;
        });

        if (!arraysEqual(selected, s.selectedNodes)) {
          s.selectedNodes = selected;
          console.log('Selected nodes:', s.selectedNodes);
        }
      });
    },
    [pixiCanvasStateId]
  );

  React.useEffect(() => {
    if (!applicationLoaded) return;

    initPixiJSCanvas(pixiApplication);

    const childrenToPush = canvasChildren(
      pixiApplication,
      pixiViewport,
      translate,
      onSelectNodes
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
    onSelectNodes,
    pixiApplication,
    pixiCanvasStateId,
    pixiViewport,
    translate,
  ]);

  return (
    <PixiJsContextProvider pixiCanvasStateId={pixiCanvasStateId}>
      <LoadableComponent {...props} onSelectNodes={onSelectNodes} />
    </PixiJsContextProvider>
  );
}

export default Canvas;
