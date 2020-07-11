import PIXI from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/utils/PixiProvider';
import { RECIPE_FONT_OFFSET } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Offsets';
import memoize from 'fast-memoize';
import {
  GREEN,
  ORANGE,
  WHITE,
  BLUE,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Colors';
import {
  NAME_FONT_SIZE,
  MACHINE_FONT_SIZE,
  LEVEL_FONT_SIZE,
  EFFICIENCY_FONT_SIZE,
  INPUT_FONT_SIZE,
  OUTPUT_FONT_SIZE,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Texts';

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
