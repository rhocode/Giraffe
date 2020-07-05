import React from 'react';
import * as PIXI from 'pixi.js';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';

function PixiJSApplication(props) {
  const { height, width } = props;

  const pixiApp = pixiJsStore.useState((s) => s.application);

  const canvasRef = React.useRef();
  const originalCanvasRef = React.useRef(null);

  React.useEffect(() => {
    if (canvasRef.current && originalCanvasRef.current !== canvasRef.current) {
      originalCanvasRef.current = canvasRef.current;
      pixiJsStore.update((s) => {
        const newApplication = new PIXI.Application({
          transparent: true,
          autoDensity: true,
          height,
          width,
          view: canvasRef.current,
          resolution: devicePixelRatio,
          antialias: true,
        });

        if (s.application?.stage?.children?.length) {
          newApplication.stage.addChild(...s.application.stage.children);
        }

        if (s.application?.destroy) {
          s.application.destroy();
        }

        s.application = newApplication;

        if (s.childQueue.length) {
          s.application.stage.addChild(...s.childQueue);
          s.childQueue = [];
        }
      });
    }
  }, [canvasRef, height, width]);

  React.useEffect(() => {
    if (pixiApp.renderer) {
      pixiApp.renderer.resize(width, height);
    }
  }, [height, pixiApp.renderer, width]);

  return <canvas ref={canvasRef} />;
}

export default PixiJSApplication;
