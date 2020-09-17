import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Viewport } from 'pixi-viewport';
import React from 'react';
import MouseState from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/enums/MouseState';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { EmptyEdge } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EmptyEdge';
import SimpleEdge from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/SimpleEdge';
import {
  GraphObject,
  GraphObjectContainer,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { enableSelectionBox } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/SelectionBox';
import { sgDevicePixelRatio } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/canvasUtils';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import {
  addChild,
  addObjectChildren,
  getChildFromStateById,
  getMultiTypedChildrenFromState,
  removeChild,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas/childrenApi';
import populateNodeData from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/satisgraphtory/populateNodeData';
import { arraysEqual } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/utils/arrayUtils';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { LocaleContext } from 'v3/components/LocaleProvider';
import { getSupportedResourceForm } from 'v3/data/loaders/buildings';
import stringGen from 'v3/utils/stringGen';

const useStyles = makeStyles(() =>
  createStyles({
    hidden: {
      display: 'none',
    },
    canvasStyles: {
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      userSelect: 'none',
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
    openModals,
    selectedRecipe,
    selectedMachine,
    selectedEdge,
  } = React.useContext(PixiJSCanvasContext);

  const styles = useStyles();

  const canvasRef = React.useRef();
  const originalCanvasRef = React.useRef(null);

  const lasTargetIsCanvas = React.useRef(false);
  const lastMode = React.useRef();
  const keypressHandled = React.useRef(false);

  const lastMouseStateRef = React.useRef(MouseState.INVALID);

  const { translate } = React.useContext(LocaleContext);

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

  const onSelectObjects = React.useCallback(
    (objectIds) => {
      pixiJsStore.update((sParent) => {
        const s = sParent[pixiCanvasStateId];

        for (const child of getMultiTypedChildrenFromState(s, [
          EdgeTemplate,
          NodeTemplate,
        ])) {
          child.container.setHighLightOn(false);
        }

        const selected = objectIds.map((id) => {
          const retrievedNode = getChildFromStateById(s, id);

          if (retrievedNode instanceof GraphObject) {
            retrievedNode.container.setHighLightOn(true);
          }

          return retrievedNode;
        });

        if (!arraysEqual(selected, s.selectedObjects)) {
          s.selectedObjects = selected;
          console.log('Selected objects:', s.selectedObjects);
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

  const selectionBoxId = React.useRef('');

  // Reenable when it's time to revisit using a grid
  // const gridId = React.useRef('');
  // React.useEffect(() => {
  //   if (!pixiRenderer) return;
  //   if (gridId.current) {
  //     removeChild(gridId.current, pixiCanvasStateId);
  //     gridId.current = '';
  //   }
  //
  //   const gfx = new PIXI.Graphics();
  //   // backboard (infrastructure)
  //   gfx.clear();
  //   gfx.lineStyle(BOX_THICKNESS, PURPLE, 1);
  //   // gfx.beginFill(GREY, 1.0);
  //   gfx.drawRect(0, 0, 100, 100);
  //   gfx.endFill();
  //
  //   const grid = pixiRenderer.generateTexture(
  //     gfx,
  //     PIXI.SCALE_MODES.LINEAR,
  //     sgDevicePixelRatio * 4,
  //     new PIXI.Rectangle(0, 0, 100, 100)
  //   );
  //   PIXI.Texture.addToCache(grid, 'grid');
  //
  //   console.log(pixiViewport.screenHeight, pixiViewport.screenWidth);
  //
  //   const container = new PIXI.Container();
  //   const texture = PIXI.utils.TextureCache['grid'];
  //
  //   // const {x, y} = pixiViewport.toWorld(pixiViewport.screenWidth, pixiViewport.screenHeight);
  //   const {x, y} = pixiViewport.toWorld(0, 0);
  //   const sprite = new PIXI.TilingSprite(texture, pixiViewport.screenWidth, pixiViewport.screenHeight);
  //   sprite.anchor.set(0, 0);
  //   sprite.position.x = x;
  //   sprite.position.y = y;
  //   container.addChild(sprite);
  //   gridId.current = addChild(container, pixiCanvasStateId);
  // }, [pixiCanvasStateId, pixiRenderer, pixiViewport])

  const pixiViewportFunc = React.useRef(null);

  // Linking callbacks
  const onStartLink = React.useCallback(
    (startLinkId) => {
      pixiJsStore.update((sParent) => {
        const s = sParent[pixiCanvasStateId];

        for (const child of getMultiTypedChildrenFromState(s, [
          EdgeTemplate,
          NodeTemplate,
        ])) {
          child.container.setHighLightOn(false);
        }

        const retrievedNode = getChildFromStateById(s, startLinkId);

        if (retrievedNode instanceof NodeTemplate) {
          retrievedNode.container.setHighLightOn(true);
        }

        // for (const child of getMultiTypedChildrenFromState(s, [
        //   NodeTemplate,
        // ])) {
        //   // turn off linkage events?
        // }

        s.sourceNodeId = startLinkId;
      });
    },
    [pixiCanvasStateId]
  );

  // Linking callbacks
  const onCancelLink = React.useCallback(() => {
    pixiJsStore.update((sParent) => {
      const s = sParent[pixiCanvasStateId];

      for (const child of getMultiTypedChildrenFromState(s, [
        EdgeTemplate,
        NodeTemplate,
      ])) {
        child.container.setHighLightOn(false);
      }
    });
  }, [pixiCanvasStateId]);

  // Linking callbacks
  const onEndLink = React.useCallback(
    (endLinkId) => {
      pixiJsStore.update((sParent) => {
        const s = sParent[pixiCanvasStateId];

        let sourceNode, targetNode;

        for (const child of getMultiTypedChildrenFromState(s, [
          EdgeTemplate,
          NodeTemplate,
        ])) {
          child.container.setHighLightOn(false);
          if (child.id === s.sourceNodeId) {
            sourceNode = child;
          }

          if (child.id === endLinkId) {
            targetNode = child;
          }
        }

        if (!targetNode || !sourceNode) {
          throw new Error('source or target not found');
        }

        const possibleResourceForms = getSupportedResourceForm(selectedEdge);

        //TODO: Fix this resource form resolution, maybe from the interface?

        const edgeProps = {
          id: stringGen(10),
          resourceForm: possibleResourceForms[0],
          sourceNode,
          targetNode,
        };

        const edge = new SimpleEdge(edgeProps);

        addObjectChildren([edge], pixiCanvasStateId, true);
      });
    },
    [pixiCanvasStateId, selectedEdge]
  );

  React.useEffect(() => {
    if (!pixiViewport || !canvasReady) return;

    previousMouseState.current = mouseState;

    pixiViewport.plugins.pause('drag');
    pixiViewport.plugins.pause('wheel');
    if (openModals === 0) {
      pixiViewport.plugins.resume('wheel');
    }
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
      console.log('REMOVIN');
      removeChild(selectionBoxId.current, pixiCanvasStateId);
      selectionBoxId.current = '';
    }

    pixiViewportFunc.current = function () {
      viewportChildContainer.hitArea = pixiViewport.hitArea;
    };

    pixiViewport.on('zoomed-end', pixiViewportFunc.current);
    pixiViewport.on('drag-end', pixiViewportFunc.current);

    const deferredRemoveChildEvents = (t) => {
      const s = t[pixiCanvasStateId];
      // for (const item of s.children) {
      //   console.log("CHILD", item);
      // }
      for (const child of getMultiTypedChildrenFromState(s, [
        NodeTemplate,
        EdgeTemplate,
      ])) {
        child.removeInteractionEvents();

        if (lastMouseStateRef.current !== mouseState) {
          if (lastMouseStateRef.current === MouseState.LINK) {
            viewportChildContainer.children.forEach((child) => {
              if (child instanceof GraphObjectContainer) {
                child.alpha = 1;
              }
            });
          }
          lastMouseStateRef.current = mouseState;
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
        onSelectObjects
      );

      pixiJsStore.update([
        deferredRemoveChildEvents,
        (t) => {
          const s = t[pixiCanvasStateId];
          for (const child of getMultiTypedChildrenFromState(s, [
            NodeTemplate,
            EdgeTemplate,
          ])) {
            child.addSelectEvents(onSelectObjects);
            // if (child instanceof NodeTemplate) {
            //   child.addSelectEvents(onSelectObjects);
            // } else if (child instanceof EdgeTemplate) {
            //   // child.addSelectEvents(
            //   child.addSelectEvents(onSelectObjects);
            // }
          }
        },
      ]);
    } else if (mouseState === MouseState.MOVE) {
      pixiViewport.plugins.resume('drag');
      if (openModals === 0) {
        pixiViewport.plugins.resume('wheel');
      }
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
              child.attachEventEmitter(eventEmitter);
              child.addDragEvents();
            } else if (child instanceof EdgeTemplate) {
              // Noop?
            }
          }
        },
      ]);
    } else if (mouseState === MouseState.ADD) {
      viewportChildContainer.interactive = true;
      viewportChildContainer.buttonMode = true;
      viewportChildContainer.hitArea = pixiViewport.hitArea;

      viewportChildContainer.on('pointerdown', function (event) {
        event.stopPropagation();

        const newPos = event.data.getLocalPosition(this.parent);

        if (!selectedMachine) return;

        const nodeData = populateNodeData(
          selectedMachine,
          selectedRecipe,
          100,
          newPos.x,
          newPos.y,
          translate
        );

        addObjectChildren([nodeData], pixiCanvasStateId);
      });

      pixiJsStore.update(deferredRemoveChildEvents);
    } else if (mouseState === MouseState.LINK) {
      pixiViewport.plugins.resume('drag');
      if (openModals === 0) {
        pixiViewport.plugins.resume('wheel');
      }
      pixiViewport.plugins.resume('pinch');

      viewportChildContainer.interactive = true;
      viewportChildContainer.buttonMode = true;
      viewportChildContainer.hitArea = pixiViewport.hitArea;

      // Don't select any objects
      onSelectObjects([]);

      const supportedResourceForms = new Set(
        getSupportedResourceForm(selectedEdge)
      );

      pixiJsStore.update([
        deferredRemoveChildEvents,
        (t) => {
          const s = t[pixiCanvasStateId];
          for (const child of getMultiTypedChildrenFromState(s, [
            NodeTemplate,
          ])) {
            if (child instanceof NodeTemplate) {
              let selected = false;

              for (const edge of [
                ...child.outputConnections,
                ...child.anyConnections,
              ]) {
                if (edge instanceof EmptyEdge) {
                  if (supportedResourceForms.has(edge.resourceForm)) {
                    selected = true;
                    break;
                  }
                }
              }

              child.container.alpha = 1;

              if (selected) {
                child.attachEventEmitter(eventEmitter);
                child.addLinkEvents(onStartLink, onEndLink, onCancelLink);
              } else {
                child.container.alpha = 0.2;
              }
            }
          }
        },
      ]);

      // viewportChildContainer.on('pointerdown', function (event) {
      //   event.stopPropagation();
      //
      //   const newPos = event.data.getLocalPosition(this.parent);
      //
      //   if (!selectedMachine) return;
      //
      //   const nodeData = populateNodeData(
      //     selectedMachine,
      //     selectedRecipe,
      //     100,
      //     newPos.x,
      //     newPos.y,
      //     translate
      //   );
      //
      //   addObjectChildren([nodeData], pixiCanvasStateId);
      // });
    }
  }, [
    canvasReady,
    eventEmitter,
    mouseState,
    onSelectObjects,
    pixiCanvasStateId,
    pixiViewport,
    viewportChildContainer,
    openModals,
    selectedRecipe,
    selectedMachine,
    translate,
    onStartLink,
    selectedEdge,
    onCancelLink,
    onEndLink,
  ]);

  React.useEffect(() => {
    if (pixiRenderer) {
      // Are both necessary?
      if (width && height && pixiRenderer.screen) {
        pixiRenderer.resize(width, height);
        pixiViewport.resize(width, height);
        if (viewportChildContainer) {
          viewportChildContainer.hitArea = new PIXI.Rectangle(
            0,
            0,
            width,
            height
          );
        }
      }
    }
  }, [height, pixiRenderer, pixiViewport, viewportChildContainer, width]);

  return (
    <canvas
      className={props.hidden ? styles.hidden : styles.canvasStyles}
      ref={canvasRef}
    />
  );
}

export default PixiJSApplication;
