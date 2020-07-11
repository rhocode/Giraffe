import React from 'react';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { sgDevicePixelRatio } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/canvasUtils';
import { Viewport } from 'pixi-viewport';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import MouseState from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/enums/MouseState';
import {
  addChild,
  removeChild,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas';
import { enableSelectionBox } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/SelectionBox';
import AdvancedNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/AdvancedNode';
import { arraysEqual } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/utils/arrayUtils';

const useStyles = makeStyles(() =>
  createStyles({
    hidden: {
      display: 'none',
    },
  })
);

function PixiJSApplication(props) {
  const { height, width } = props;

  const {
    pixiCanvasStateId,
    pixiViewport,
    mouseState,
    pixiRenderer,
    viewportChildContainer,
    canvasReady,
  } = React.useContext(PixiJSCanvasContext);

  const styles = useStyles();

  const canvasRef = React.useRef();
  const originalCanvasRef = React.useRef(null);

  // const lastTarget = React.useRef();

  // React.useEffect(() => {
  //   const mouseDownEvent = function (event) {
  //     lastTarget.current = event.target;
  //     console.log('mousedown');
  //   };
  //
  //   const keyDownEvent = function (event) {
  //     if (lastTarget.current === canvasRef.current) {
  //       console.log('keydown');
  //     }
  //   };
  //   window.addEventListener('mousedown', mouseDownEvent, false);
  //
  //   window.addEventListener('keydown', keyDownEvent, false);
  //   return () => {
  //     window.removeEventListener('mousedown', mouseDownEvent);
  //     window.removeEventListener('keydown', keyDownEvent);
  //   };
  // }, []);

  const onSelectNodes = React.useCallback(
    (nodeIds) => {
      pixiJsStore.update((sParent) => {
        const s = sParent[pixiCanvasStateId];

        for (const child of s.children.values()) {
          if (child instanceof AdvancedNode) {
            child.container.highLight.visible = false;
          }
        }

        const selected = nodeIds.map((nodeId) => {
          const retrievedNode = s.children.get(nodeId);
          if (retrievedNode instanceof AdvancedNode) {
            retrievedNode.container.highLight.visible = true;
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
    if (originalCanvasRef.current !== canvasRef.current) {
      originalCanvasRef.current = canvasRef.current;

      pixiJsStore.update((sParent) => {
        const s = sParent[pixiCanvasStateId];

        let newApplication = new PIXI.Application({
          transparent: true,
          autoDensity: true,
          height,
          width,
          view: canvasRef.current,
          resolution: sgDevicePixelRatio,
          antialias: true,
        });

        const viewport = new Viewport({
          screenWidth: width,
          screenHeight: height,
          worldWidth: 20000,
          worldHeight: 20000,
          interaction: newApplication.renderer.plugins.interaction,
        });

        newApplication.stage.addChild(viewport);

        if (s?.application?.destroy) {
          s.application.destroy();
        }

        const container = new PIXI.Container();
        s.viewportChildContainer = container;
        viewport.addChild(container);

        s.viewport = viewport;

        viewport.drag().pinch().wheel({
          smooth: 5,
        });

        s.application = newApplication;

        s.applicationLoaded = true;
      });
    }
  }, [canvasRef, height, pixiCanvasStateId, width]);

  const previousMouseState = React.useRef(null);

  const selectionBoxId = React.useRef(null);
  const pixiViewportFunc = React.useRef(null);

  React.useEffect(() => {
    if (!pixiViewport || !canvasReady) return;

    previousMouseState.current = mouseState;

    pixiViewport.plugins.pause('drag');
    pixiViewport.plugins.resume('wheel');
    pixiViewport.plugins.pause('pinch');
    viewportChildContainer.interactive = false;
    viewportChildContainer.buttonMode = false;
    viewportChildContainer.hitArea = null;
    viewportChildContainer.removeAllListeners();

    if (pixiViewportFunc.current) {
      pixiViewport.off('zoomed-end', pixiViewportFunc.current);
      pixiViewport.off('drag-end', pixiViewportFunc.current);
      pixiViewportFunc.current = null;
    }

    if (selectionBoxId.current) {
      removeChild(selectionBoxId.current, pixiCanvasStateId);
      selectionBoxId.current = null;
    }

    pixiViewportFunc.current = function () {
      viewportChildContainer.hitArea = pixiViewport.hitArea;
    };

    pixiViewport.on('zoomed-end', pixiViewportFunc.current);
    pixiViewport.on('drag-end', pixiViewportFunc.current);

    const deferredRemoveChildEvents = (t) => {
      const s = t[pixiCanvasStateId];
      for (const child of s.children.values()) {
        if (child instanceof AdvancedNode) {
          child.removeInteractionEvents();
        }
      }
    };

    if (mouseState === MouseState.SELECT) {
      viewportChildContainer.interactive = true;
      viewportChildContainer.buttonMode = true;
      viewportChildContainer.hitArea = pixiViewport.hitArea;

      const selectionBox = new PIXI.Graphics();
      selectionBoxId.current = addChild(selectionBox, pixiCanvasStateId);

      enableSelectionBox(
        pixiViewport,
        viewportChildContainer,
        selectionBox,
        onSelectNodes
      );
      pixiJsStore.update([
        deferredRemoveChildEvents,
        (t) => {
          const s = t[pixiCanvasStateId];
          for (const child of s.children.values()) {
            if (child instanceof AdvancedNode) {
              child.addSelectEvents(onSelectNodes);
            }
          }
        },
      ]);
    } else if (mouseState === MouseState.MOVE) {
      pixiViewport.plugins.resume('drag');
      pixiViewport.plugins.resume('wheel');
      pixiViewport.plugins.resume('pinch');

      pixiJsStore.update([
        deferredRemoveChildEvents,
        (t) => {
          const s = t[pixiCanvasStateId];
          for (const child of s.children.values()) {
            if (child instanceof AdvancedNode) {
              child.addDragEvents();
            }
          }
        },
      ]);
    }
  }, [
    canvasReady,
    mouseState,
    onSelectNodes,
    pixiCanvasStateId,
    pixiViewport,
    viewportChildContainer,
  ]);

  React.useEffect(() => {
    if (pixiRenderer) {
      // Are both necessary?
      pixiRenderer.resize(width, height);
      pixiViewport.resize(width, height);
    }
  }, [height, pixiRenderer, pixiViewport, width]);

  return (
    <canvas className={props.hidden ? styles.hidden : null} ref={canvasRef} />
  );
}

export default PixiJSApplication;
