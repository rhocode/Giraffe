import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useThemeProvider } from 'common/react/SGThemeProvider';
import { Viewport } from 'pixi-viewport';
import React from 'react';
import MouseState from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/enums/MouseState';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import {
  GraphObject,
  GraphObjectContainer,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { enableSelectionBox } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/SelectionBox';
import { sgDevicePixelRatio } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/canvasUtils';
import { loadSharedTextures } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/loadSharedTextures';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import {
  addChild,
  addObjectChildren,
  addObjectChildrenWithinState,
  getChildFromStateById,
  getMultiTypedChildrenFromState,
  removeChild,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas/childrenApi';
import populateNewNodeData from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/satisgraphtory/populateNewNodeData';
import serializeGraphObjects from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/serialization/serialize';
import { arraysEqual } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/utils/arrayUtils';
import { setUpLinkInitialState } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/Actions/linkFunctions';
import { removeChildEvents } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/Actions/sharedFunctions';
import { PixiJSCanvasContext } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/react/PixiJSCanvas/PixiJsCanvasContext';
import {
  generateNewPixiCanvasStore,
  pixiJsStore,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { LocaleContext } from 'v3/components/LocaleProvider';
import { getSupportedResourceForm } from 'v3/data/loaders/buildings';

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
  const { height, width, initialCanvasChildren, onFinishLoad } = props;

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

          console.log(serializeGraphObjects(selected));
        }
      });
    },
    [pixiCanvasStateId]
  );

  React.useEffect(() => {
    // console.log(generateRecipeEnums());
  }, []);

  const theme = useThemeProvider();

  React.useEffect(() => {
    if (originalCanvasRef.current !== canvasRef.current) {
      originalCanvasRef.current = canvasRef.current;

      pixiJsStore.update((sParent) => {
        let s = sParent[pixiCanvasStateId];
        if (!s) {
          sParent[pixiCanvasStateId] = generateNewPixiCanvasStore();
          s = sParent[pixiCanvasStateId];
        }

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

        loadSharedTextures(newApplication.renderer, theme);

        const childrenToPush = initialCanvasChildren(
          newApplication,
          pixiViewport,
          translate,
          theme
        );

        addObjectChildrenWithinState(
          childrenToPush || [],
          pixiCanvasStateId
        )(sParent);
        newApplication.renderer.render(newApplication.stage);
        // Run the callback
        onFinishLoad();

        s.canvasReady = true;
      });
    }
  }, [
    canvasRef,
    height,
    pixiCanvasStateId,
    pixiViewport,
    initialCanvasChildren,
    theme,
    translate,
    width,
    onFinishLoad,
  ]);

  // Update the theme for each child
  React.useEffect(() => {
    if (!canvasReady) return;

    pixiJsStore.update((t) => {
      const s = t[pixiCanvasStateId];

      for (const child of s.children) {
        if (child instanceof GraphObject) {
          child.updateTheme(theme);
        }
      }
    });
  }, [canvasReady, pixiCanvasStateId, theme]);

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
      removeChild(selectionBoxId.current, pixiCanvasStateId);
      selectionBoxId.current = '';
    }

    pixiViewportFunc.current = function () {
      viewportChildContainer.hitArea = pixiViewport.hitArea;
    };

    pixiViewport.on('zoomed-end', pixiViewportFunc.current);
    pixiViewport.on('drag-end', pixiViewportFunc.current);

    const deferredRemoveChildEvents = removeChildEvents(pixiCanvasStateId);

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
        onSelectObjects,
        theme
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

        const nodeData = populateNewNodeData(
          selectedMachine,
          selectedRecipe,
          100,
          newPos.x,
          newPos.y,
          translate,
          theme
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
        setUpLinkInitialState(
          eventEmitter,
          pixiCanvasStateId,
          supportedResourceForms,
          selectedEdge
        ),
      ]);
    }
  }, [
    canvasReady,
    eventEmitter,
    mouseState,
    onSelectObjects,
    openModals,
    pixiCanvasStateId,
    pixiViewport,
    selectedEdge,
    selectedMachine,
    selectedRecipe,
    theme,
    translate,
    viewportChildContainer,
  ]);

  React.useEffect(() => {
    if (pixiRenderer) {
      // Are both necessary?
      if (width && height && pixiRenderer.screen) {
        pixiRenderer.resize(width, height);
        pixiViewport.resize(width, height);
        if (viewportChildContainer) {
          const originPoint = pixiViewport.toWorld(0, 0);
          const maxPoint = pixiViewport.toWorld(width, height);
          viewportChildContainer.hitArea = new PIXI.Rectangle(
            originPoint.x,
            originPoint.y,
            maxPoint.x - originPoint.x,
            maxPoint.y - originPoint.y
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
