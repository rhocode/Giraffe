import { Viewport } from 'pixi-viewport';
import deserializeGraphObjects from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/serialization/deserialize';
import ExternalInteractionManager from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/ExternalInteractionManager';

const initCanvasChildren = (
  pixiJS: PIXI.Application,
  viewport: Viewport,
  translate: (source: string) => string,
  externalInteractionManager: ExternalInteractionManager
) => {
  // TODO: Get this from external sources

  const urlParams = new URLSearchParams(window.location.search);

  let data;

  if (urlParams.get('useBlank')) {
    data = {
      d: 'AIACA===',
      c: 0,
      v: '0.1.0',
    };
  } else {
    data = {
      d: 'AIACA===',
      c: 0,
      v: '0.1.0',
    };
  }

  console.time('loadNodes');
  const children = deserializeGraphObjects(
    data,
    translate,
    externalInteractionManager
  );
  console.timeEnd('loadNodes');

  return children;
};

export default initCanvasChildren;
