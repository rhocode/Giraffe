import React from 'react';
import * as PIXI from 'pixi.js';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';

function PixiJSApplication(props) {
  const { height, width } = props;

  const pixiApp = pixiJsStore.useState((s) => s.application);

  const canvasRef = React.useCallback((node) => {
    if (node !== null) {
      pixiJsStore.update((s) => {
        const newApplication = new PIXI.Application({
          transparent: true,
          autoDensity: true,
          height: 200,
          width: 200,
          view: node,
          resolution: devicePixelRatio,
          antialias: true,
        });

        if (s.application?.stage?.children?.length) {
          newApplication.stage.addChild(...s.application.stage.children);
        }

        s.application = newApplication;

        if (s.childQueue.length) {
          s.application.stage.addChild(...s.childQueue);
          s.childQueue = [];
        }
      });
    }
  }, []);

  React.useEffect(() => {
    if (pixiApp.renderer) {
      pixiApp.renderer.resize(width, height);
    }
  }, [height, pixiApp.renderer, width]);

  return <canvas ref={canvasRef} />;
}

export default PixiJSApplication;
