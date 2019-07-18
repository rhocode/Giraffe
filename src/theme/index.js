import {createMuiTheme} from '@material-ui/core';

const paletteLight = {
  type: 'light',
  primary: {main: '#FF9100', dark: '#FF6D00'},
  secondary: {main: '#FF3D00', contrastText: '#FAFAFA'}
};

const paletteDark = {
  type: 'dark',
  primary: {main: '#FF9100', dark: '#FF6D00'},
  secondary: {main: '#FF3D00', contrastText: '#FAFAFA'}
};

const themeName = 'Pizazz Vermilion Gayal';

export const baseTheme = {
  overrides: {
    GraphAddMachineButton: {
      height: 150,
      width: 150,
      margin: 10
    },
    GraphDrawer: {
      width: 260
    },
    GraphAppBar: {
      height: 64
    },
    common: {
      HeaderMessaging: {
        height: 50
      }
    }
  },
  typography: {
    useNextVariants: true
  },
  palette: paletteDark,
  themeName
};

export const themeDark = createMuiTheme(
  Object.assign({}, baseTheme, {palette: paletteDark})
);
export const themeLight = createMuiTheme(
  Object.assign({}, baseTheme, {palette: paletteLight})
);
