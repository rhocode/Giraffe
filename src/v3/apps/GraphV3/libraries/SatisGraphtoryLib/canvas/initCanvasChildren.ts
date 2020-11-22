import { Viewport } from 'pixi-viewport';
import deserializeGraphObjects from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/serialization/deserialize';
import ExternalInteractionManager from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/ExternalInteractionManager';

const initCanvasChildren = (
  pixiJS: PIXI.Application,
  viewport: Viewport,
  translate: (source: string) => string,
  externalInteractionManager: ExternalInteractionManager,
  loadedData?: Record<string, any>
) => {
  // TODO: Get this from external sources

  let data;

  if (!loadedData || Object.keys(loadedData).length === 0) {
    data = {
      d:
        'CgBgCGAAYBCQFJSAYACwcABwCkAWBBgaYDFkBYAJIGqBKxAIIDlIAMAA8gHEAkNgeoABAIACAAAgAG8AKiYAiQJAAiAJ0BFgQDhkAEgDdkACUBMsQDAAdAFiAAgEgAuQA9INAMUBzsXYBZmXAC1AAUAIAAJAKAACgDIbADQkDACAO9sAMDEAA0wQQBQEiA2AI4CAJMAaZAAPkIAIgBOZTaQAKsAVAAVANb2AJEAlwDOcgDYLOkAEkIAEUIATQAdIgAP6QA6kDrLADxCLJAAF+kA3lHpVABdAI1IQA===',
      c: 0,
      v: '0.1.0',
    };
  } else {
    data = loadedData;
  }

  console.time('loadNodes');
  const children = deserializeGraphObjects(
    data,
    translate,
    externalInteractionManager
  );
  console.timeEnd('loadNodes');
  //
  // console.log(generateBuildingEnums());
  // console.log(generateItemEnums());
  // console.log(generateRecipeEnums());

  return children;
};

export default initCanvasChildren;
