import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { RECIPE_FONT_OFFSET } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/consts';
import memoize from 'fast-memoize';

const MACHINE_FONT_SIZE = 24;
const LEVEL_FONT_SIZE = 24;
const EFFICIENCY_FONT_SIZE = 24;
const INPUT_FONT_SIZE = 20;
const OUTPUT_FONT_SIZE = 20;

const GREEN = 0x15cb07;
const ORANGE = 0xffa328;
const WHITE = 0xffffff;
const BLUE = 0x47a3ff;

const NAME_FONT_SIZE = 18;

export const RECIPE_STYLE = memoize(
  (width: number) =>
    new PIXI.TextStyle({
      align: 'center',
      fill: WHITE,
      fontSize: NAME_FONT_SIZE,
      fontFamily: '"Bebas Neue", sans-serif',
      // breakWords: true,
      wordWrapWidth: width - RECIPE_FONT_OFFSET,
      wordWrap: true,
    })
);

export const MACHINE_STYLE = memoize(
  () =>
    new PIXI.TextStyle({
      align: 'center',
      fill: WHITE,
      fontSize: MACHINE_FONT_SIZE,
      fontFamily: '"Bebas Neue", sans-serif',
    })
);

export const TIER_STYLE = memoize(
  () =>
    new PIXI.TextStyle({
      align: 'center',
      fill: WHITE,
      fontSize: LEVEL_FONT_SIZE,
      fontFamily: '"Roboto Condensed", sans-serif',
    })
);

export const OVERCLOCK_STYLE = memoize(
  () =>
    new PIXI.TextStyle({
      align: 'right',
      fill: BLUE,
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
