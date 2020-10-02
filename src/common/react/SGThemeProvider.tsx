import React from 'react';
import Colors from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/consts/Colors';
import { EResourceForm } from '.data-landing/interfaces/enums';

// import { Store } from 'pullstate';
//
// export const errorStore = new Store({
//   errorType: null,
// });

const MACHINE_CLASS_MAP: Record<string, string> = {
  'building-assembler': 'machine',
  'building-constructor': 'machine',
  'building-foundry': 'machine',
  'building-manufacturer': 'machine',
  'building-oil-refinery': 'machine',
  'building-smelter': 'machine',
  'building-miner': 'machine',
  'building-oil-pump': 'machine',
  'building-water-pump': 'machine',
  'building-pipeline-pump': 'machine',
  'machine-group-logistics': 'infra',
  'machine-group-liquid-storage': 'storage',
  'machine-group-item-storage': 'storage',
};

export const getTypeFromMachineClass = (slug: string): string => {
  return MACHINE_CLASS_MAP[slug] || 'machine';
};

const graphTheme = {
  name: 'DefaultTheme',
  canvas: {
    background: Colors.DARKER_GREY,
  },
  nodes: {
    machines: {
      border: Colors.YELLOW,
      backboard: Colors.DARK_GREY,
    },
    infrastructure: {
      border: Colors.PURPLE,
      backboard: Colors.DARK_GREY,
    },
    storage: {
      border: Colors.BLUE,
      backboard: Colors.DARK_GREY,
    },
    highlight: Colors.DARK_ORANGE,
  },
  connectors: {
    in: Colors.GREEN,
    out: Colors.ORANGE,
    any: Colors.RED,
  },
  edges: {
    [EResourceForm.RF_SOLID]: Colors.BELT_ORANGE,
    [EResourceForm.RF_LIQUID]: Colors.BLUE,
    default: Colors.ORANGE,
    highlight: Colors.DARK_ORANGE,
  },
  overclock: {
    stroke: Colors.DARK_GREY,
    fill: Colors.WHITE,
  },
  tier: {
    stroke: Colors.DARK_GREY,
    fill: Colors.WHITE,
  },
  nodeName: {
    fill: Colors.WHITE,
  },
  nodeSubText: {
    fill: Colors.WHITE,
  },
  selectionBox: {
    fill: Colors.ORANGE,
    fillOpacity: 0.15,
    stroke: Colors.ORANGE,
  },
};

const SGThemeContext = React.createContext(graphTheme);

function SGErrorBoundary(props: any) {
  const value = graphTheme;
  return <SGThemeContext.Provider value={value} {...props} />;
}

export function useThemeProvider() {
  const context = React.useContext(SGThemeContext);

  if (!context) {
    throw new Error('useThemeProvider must be used within a SGThemeContext');
  }

  return context;
}

export default SGErrorBoundary;
