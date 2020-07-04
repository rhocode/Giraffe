import React from 'react';
import * as PIXI from 'pixi.js';
import { pixiJsStore } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/stores/PixiJSStore';

function PixiJSApplication(props) {
  const { height, width } = props;
  const canvasRef = React.useRef();

  const pixiApp = pixiJsStore.useState((s) => s.application);

  React.useEffect(() => {
    pixiJsStore.update((s) => {
      s.application = new PIXI.Application({
        transparent: true,
        autoDensity: true,
        height: 1,
        width: 1,
        view: canvasRef.current,
        resolution: devicePixelRatio,
      });
      if (s.childQueue.length) {
        s.application.stage.addChild(...s.childQueue);
        s.childQueue = [];
      }
    });
  }, [canvasRef]);

  React.useEffect(() => {
    if (pixiApp.renderer) {
      pixiApp.renderer.resize(width, height);
    }
  }, [height, pixiApp.renderer, width]);

  return <canvas ref={canvasRef} />;
}

export default PixiJSApplication;
