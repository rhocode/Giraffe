import { createMuiTheme } from '@material-ui/core';

const paletteLight = {
  type: 'light',
  primary: { main: '#FF9100' },
  secondary: { main: '#FF3D00', contrastText: '#FAFAFA' }
};

const paletteDark = {
  type: 'dark',
  primary: { main: '#FF9100' },
  secondary: { main: '#FF3D00', contrastText: '#FAFAFA' }
};

const themeName = 'Pizazz Vermilion Gayal';

export const themeLight = createMuiTheme({
  overrides: {
    GraphDrawer: {
      width: 260
    },
    GraphAppBar: {
      height: 64
    }
  },
  typography: {
    useNextVariants: true
  },
  palette: paletteLight,
  themeName
});

export const themeDark = createMuiTheme({
  overrides: {
    GraphDrawer: {
      width: 260
    },
    GraphAppBar: {
      height: 64
    }
  },
  typography: {
    useNextVariants: true
  },
  palette: paletteDark,
  themeName
});

export const canvasBackgroundColor = themeDark.palette.background.default;
