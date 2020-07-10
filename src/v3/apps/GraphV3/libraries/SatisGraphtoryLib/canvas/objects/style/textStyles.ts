import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { RECIPE_FONT_OFFSET } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/consts';
import memoize from 'fast-memoize';

const LEVEL_FONT_SIZE = 28;
const EFFICIENCY_FONT_SIZE = 28;
const INPUT_FONT_SIZE = 20;
const OUTPUT_FONT_SIZE = 20;

const GREEN = 0x15cb07;
const ORANGE = 0xffa328;
const WHITE = 0xffffff;

const NAME_FONT_SIZE = 22;

export const RECIPE_STYLE = memoize(
  (width: number) =>
    new PIXI.TextStyle({
      align: 'left',
      fill: WHITE,
      fontSize: NAME_FONT_SIZE,
      fontFamily: '"Bebas Neue", sans-serif',
      breakWords: true,
      wordWrapWidth: width - RECIPE_FONT_OFFSET,
      wordWrap: true,
    })
);

export const TIER_STYLE = memoize(
  () =>
    new PIXI.TextStyle({
      align: 'left',
      fill: WHITE,
      fontSize: LEVEL_FONT_SIZE,
      fontFamily: '"Roboto Condensed", sans-serif',
    })
);

export const OVERCLOCK_STYLE = memoize(
  () =>
    new PIXI.TextStyle({
      align: 'left',
      fill: GREEN,
      fontSize: EFFICIENCY_FONT_SIZE,
      fontFamily: '"Roboto Condensed", sans-serif',
    })
);

export const INPUT_STYLE = memoize(
  () =>
    new PIXI.TextStyle({
      align: 'left',
      fill: GREEN,
      fontSize: INPUT_FONT_SIZE,
      fontFamily: '"Roboto Condensed", sans-serif',
    })
);

export const OUTPUT_STYLE = memoize(
  () =>
    new PIXI.TextStyle({
      align: 'left',
      fill: ORANGE,
      fontSize: OUTPUT_FONT_SIZE,
      fontFamily: '"Roboto Condensed", Helvetica, sans-serif',
    })
);
