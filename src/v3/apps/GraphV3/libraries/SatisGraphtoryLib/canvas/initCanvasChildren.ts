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
  // const data = {
  //   "d": "LIJIswUgwAjAKAUIN4HuAmAzASwFYG0CXALQFYA1A/ACBkBqAYACEBIcAOhgNcByA+gAIAdgN0BHAIcApgKoBBAIhwAgwgAFACgB0ggF0EAzAAiA0AHyAwwHMADwEgAPQFcAZOIBzAK8YBngLkBnAGSASQAUkFUAQwBymABAgGCAMI8ACRwAAwABgCMAXtoAJgBIgDyQACCCUIIAGIBT/0kAYuAAI4AtLAAuAEaAIgAm4AA0gGUAGgB1/u4ADYAWAC9jABmAa0CAdIAtiaWAXAA1gEWAUwAc500AZoBPABelgCxmgHUABK2AbQBMPIAfABpgCwAAnAnh/gBRI4AfoAIw9CkCABiSBYAWoAUQA9gBQAGOkgAZAD1hTyADGHt0AMsAbFkAHQAMQ6ADRAF8AF8AfwAmsVigAHAAQAAuAOIAcIAsQB/gD2AHmAPgAcFkcA8eAAmXMiFQAC7BABZ9QAfdIAIp0m78XwAD5yHIAdwA6ywepTYwoASYA2ZI4g8AFUAIYAP2c5fIAPIADIAC3CMpalM4AKSSACgGoAtAB4ACoADcliWdpoAGf6MaY1YAGAAFuo8N0AHA7OJLOGYgCUJAApYMSXzVL8VUXk26AJwAG5IAHiSwA37wABAADQBKgD0ADYCHqF3qALtz4cAb872OTw7V60MADFmQBjJYAbn0CwA7hkACFcAAKNtFggwJHEzIlgAHHc+IAOQAB0AI8gYeAC8YZvAsvAZAyZyFAAGr83QAAziAAJVK+4AKxSsIAAk3AEJYVHfAAyMO5HrJwDKdrQADCAD7ACf3xgFyuLXhQQA=",
  //   "c": 1,
  //   "v": "0.1.0"
  // };

  // const data = {
  //   "d": "McJABwBgKBApEBUICWIAYIBaIAczACOCIQIAQgB4A6AQADgAyBAgJoBkAoAGZwE0BAAHAA0AAUAIAM0AgANAAk8QGoACmQCiTAKgBJMgFgAFACGAVQAGAYQBMAZAG4ubAIQBSUQFiAWSACUHABiALQC2ADEAgMEAGoA8gHAgqgBtgCwAYICAXGkAfAAcgFcAZKoAXwB9gEn+AArLAEgAMssARYAIgESATFqAMwBBgFH7AB8OSwBOAAEAVlGAQwBvdQ55aYArBgWtjwAMXgAAjaC+gBOAVpoAWuiAJ3EAGAAPgGeAboBvgH+AXOkAAmpYQMYEAYjCADVRF4APkNADaAHcAHdBZAAG4ACAALXgAegAlQA/0wAXoAOAASyxaFoAVa6+nq3wA4QAvBEATMhAHSAMJgUw6AB2XFhAF0NgBBDYADYg8oCewAm0wNgAnkAca4AVSytjoNAAbRiALwEBAATwAnQN+AAAIA==",
  //   "c": 1,
  //   "v": "0.1.0"
  // };

  const data = {
    d:
      'McI5AMBRwFfAGcAW8ADs4BCAjAzAYgEaBNABIA2AagCQBsA2AEnoG4AkAbIGAAxgNABKAQABZAeYAEARIBFAAYAFAUYAzAEZXY1ACYAXcgKcBJgAAAgANAAqgDhmArABUA6AFqAawAaA0gHcTVtgAQQCV2ADGAOfw2AAmAKEA1QBWAG4AEAAguAB0kABcJiZAA==',
    c: 1,
    v: '0.1.0',
  };

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
