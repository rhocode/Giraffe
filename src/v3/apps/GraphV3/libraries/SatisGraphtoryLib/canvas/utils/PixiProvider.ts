import * as PIXIMain from 'pixi.js';
import * as PIXILegacy from 'pixi.js-legacy';

const urlParams = new URLSearchParams(window.location.search);

let PIXI;

if (urlParams.get('useCanvas')) {
  console.log('Using Canvas Pixi');
  PIXI = PIXILegacy;
} else {
  console.log('Using WebGL Pixi');
  PIXI = PIXIMain;
}

export default PIXI as any;
