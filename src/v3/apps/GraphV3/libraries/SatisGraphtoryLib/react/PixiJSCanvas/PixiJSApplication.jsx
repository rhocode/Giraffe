import React from 'react';
import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import sgDevicePixelRatio from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils';
import { Viewport } from 'pixi-viewport';

const useStyles = makeStyles((theme) =>
  createStyles({
    hidden: {
      display: 'none',
    },
  })
);

function PixiJSApplication(props) {
  const { height, width } = props;

  const styles = useStyles();

  const pixiApp = pixiJsStore.useState((s) => s.application);
  const pixiViewport = pixiJsStore.useState((s) => s.viewport);
  const canvasRef = React.useRef();
  const originalCanvasRef = React.useRef(null);

  React.useEffect(() => {
    if (canvasRef.current && originalCanvasRef.current !== canvasRef.current) {
      console.log('different canvas');
      originalCanvasRef.current = canvasRef.current;
      pixiJsStore.update((s) => {
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
          worldWidth: width * 2,
          worldHeight: height * 2,
          // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
          interaction: newApplication.renderer.plugins.interaction,
        });

        newApplication.stage.addChild(viewport);

        viewport.drag().pinch().wheel({
          smooth: 10,
        });
        // .decelerate()

        // Figure this out later, if we need to factor in the viewport
        // if (s.application?.stage?.children?.length) {
        //   newApplication.stage.addChild(...s.application.stage.children.slice);
        // }

        if (s.application?.destroy) {
          s.application.destroy();
        }

        s.viewport = viewport;

        viewport.on('mousemove', function (mouseData) {
          // console.log(viewport.toWorld(mouseData.data.global));
        });

        s.application = newApplication;

        if (s.childQueue.length) {
          s.viewport.addChild(...s.childQueue);
          s.childQueue = [];
        }
        // } catch(e) {
        //  // Probably ask the user to turn on webGL
        // }
      });
    }
  }, [canvasRef, height, width]);

  React.useEffect(() => {
    if (pixiApp.renderer) {
      // Are both necessary?
      pixiApp.renderer.resize(width, height);
      pixiViewport.resize(width, height);
    }
  }, [height, pixiApp.renderer, pixiViewport, width]);

  return (
    <canvas className={props.hidden ? styles.hidden : null} ref={canvasRef} />
  );
}

export default PixiJSApplication;
