import React from 'react';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { sgDevicePixelRatio } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/canvasUtils';
import { Viewport } from 'pixi-viewport';

const useStyles = makeStyles((theme) =>
  createStyles({
    hidden: {
      display: 'none',
    },
  })
);

function PixiJSApplication(props) {
  const { height, width, pixiCanvasStateId } = props;

  const styles = useStyles();

  const pixiViewport = pixiJsStore.useState(
    (s) => s[pixiCanvasStateId].viewport
  );

  const canvasRef = React.useRef();
  const originalCanvasRef = React.useRef(null);

  React.useEffect(() => {
    if (canvasRef.current && originalCanvasRef.current !== canvasRef.current) {
      originalCanvasRef.current = canvasRef.current;
      pixiJsStore.update((sParent) => {
        const s = sParent[pixiCanvasStateId];

        console.log('Updating Applications');

        // try {
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
          // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
          interaction: newApplication.renderer.plugins.interaction,
        });

        newApplication.stage.addChild(viewport);

        viewport.drag().pinch().wheel({
          smooth: 10,
        });
        // .decelerate()

        if (s.application?.destroy) {
          s.application.destroy();
        }

        s.viewport = viewport;

        viewport.on('mousemove', function (mouseData) {
          // console.log(viewport.toWorld(mouseData.data.global));
        });

        s.application = newApplication;

        if (s.childQueue?.length) {
          s.viewport.addChild(...s.childQueue);
          s.childQueue = [];
        }

        s.applicationLoaded = true;
        // } catch(e) {
        //  // Probably ask the user to turn on webGL
        // }
      });
    }
  }, [canvasRef, height, pixiCanvasStateId, width]);

  const pixiRenderer = pixiJsStore.useState(
    (s) => s[pixiCanvasStateId].application?.renderer
  );

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
