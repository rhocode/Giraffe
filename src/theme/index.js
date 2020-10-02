import {createMuiTheme} from '@material-ui/core';
import {produce} from 'immer';

const paletteLight = {
  type : 'light',
  primary : {main : '#FF9100', dark : '#FF6D00'},
  secondary : {main : '#FF3D00', contrastText : '#FAFAFA'},
};

const paletteDark = {
  type : 'dark',
  primary : {main : '#FF9100', dark : '#FF6D00'},
  secondary : {main : '#FF3D00', contrastText : '#FAFAFA'},
};

const themeName = 'Pizazz Vermilion Gayal';

export const baseTheme = {
  overrides : {
    GraphAddMachineButton : {
      height : 150,
      width : 150,
      margin : 10,
    },
    GraphDrawer : {
      width : 400,
    },
    GraphAppBar : {
      height : 64,
    },
    common : {
      HeaderMessaging : {
        height : 50,
      },
    },
  },
  typography : {
    useNextVariants : true,
  },
  palette : paletteDark,
  themeName,
};

export const themeDark = createMuiTheme(
    produce(baseTheme, (draftState) => { draftState.palette = paletteDark;}));
export const themeLight = createMuiTheme(
    produce(baseTheme, (draftState) => { draftState.palette = paletteLight;}));
