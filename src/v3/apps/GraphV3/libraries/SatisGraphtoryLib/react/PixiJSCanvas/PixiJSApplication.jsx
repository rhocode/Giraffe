import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Viewport } from 'pixi-viewport';
import React from 'react';
import MouseState from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/enums/MouseState';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import AdvancedNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/AdvancedNode';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { enableSelectionBox } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/SelectionBox';
import { sgDevicePixelRatio } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/canvasUtils';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import {
  addChild,
  getChildFromStateById,
  getChildrenFromState,
  getMultiTypedChildrenFromState,
  removeChild,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas';
import { arraysEqual } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/utils/arrayUtils';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';

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
    aliasCanvasObjects,
    eventEmitter,
  } = React.useContext(PixiJSCanvasContext);

  const styles = useStyles();

  const canvasRef = React.useRef();
  const originalCanvasRef = React.useRef(null);

  const lasTargetIsCanvas = React.useRef(false);
  const lastMode = React.useRef();
  const keypressHandled = React.useRef(false);

  React.useEffect(() => {
    const mouseDownEvent = function (event) {
      let iteration = event.target;
      lasTargetIsCanvas.current = false;
      while (iteration) {
        if (
          aliasCanvasObjects.has(iteration) ||
          iteration === canvasRef.current
        ) {
          lasTargetIsCanvas.current = true;
          break;
        }
        iteration = iteration.parentNode;
      }
    };

    const keyDownEvent = function (event) {
      // Shift
      if (
        keypressHandled.current !== true &&
        event.keyCode === 16 &&
        lasTargetIsCanvas.current
      ) {
        keypressHandled.current = true;
        if (mouseState === MouseState.SELECT) {
          lastMode.current = mouseState;
          pixiJsStore.update((sParent) => {
            const s = sParent[pixiCanvasStateId];
            s.mouseState = MouseState.MOVE;
          });
        } else if (mouseState === MouseState.MOVE) {
          lastMode.current = mouseState;
          pixiJsStore.update((sParent) => {
            const s = sParent[pixiCanvasStateId];
            s.mouseState = MouseState.SELECT;
          });
        }
      }
    };

    const keyUpEvent = function () {
      if (keypressHandled.current && lasTargetIsCanvas.current) {
        keypressHandled.current = false;

        if (lastMode.current !== null) {
          pixiJsStore.update((sParent) => {
            const s = sParent[pixiCanvasStateId];
            s.mouseState = lastMode.current;
          });
          lastMode.current = null;
        }
      }
    };

    window.addEventListener('mousedown', mouseDownEvent, false);
    window.addEventListener('keydown', keyDownEvent, false);
    window.addEventListener('keyup', keyUpEvent, false);

    return () => {
      window.removeEventListener('mousedown', mouseDownEvent);
      window.removeEventListener('keydown', keyDownEvent);
      window.removeEventListener('keyup', keyUpEvent);
    };
  }, [aliasCanvasObjects, mouseState, pixiCanvasStateId]);

  const onSelectNodes = React.useCallback(
    (nodeIds) => {
      pixiJsStore.update((sParent) => {
        const s = sParent[pixiCanvasStateId];

        for (const child of getChildrenFromState(s)) {
          if (child instanceof AdvancedNode) {
            child.container.highLight.visible = false;
          }
        }

        const selected = nodeIds.map((nodeId) => {
          const retrievedNode = getChildFromStateById(s, nodeId);
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
        if (!s) return;

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

        if (s.application?.destroy) {
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
      for (const child of getMultiTypedChildrenFromState(s, [
        NodeTemplate,
        EdgeTemplate,
      ])) {
        child.removeInteractionEvents();
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
          for (const child of getMultiTypedChildrenFromState(s, [
            NodeTemplate,
            EdgeTemplate,
          ])) {
            if (child instanceof NodeTemplate) {
              child.addSelectEvents(onSelectNodes);
            } else if (child instanceof EdgeTemplate) {
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
          for (const child of getMultiTypedChildrenFromState(s, [
            NodeTemplate,
            EdgeTemplate,
          ])) {
            if (child instanceof NodeTemplate) {
              child.addDragEvents(eventEmitter);
            } else if (child instanceof EdgeTemplate) {
              // Noop?
            }
          }
        },
      ]);
    }
  }, [
    canvasReady,
    eventEmitter,
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
