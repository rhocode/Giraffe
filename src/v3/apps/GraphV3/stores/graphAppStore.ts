import { Store } from 'pullstate';
import {
  SatisGraphtoryEdge,
  SatisGraphtoryNode,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import stringGen from 'v3/utils/stringGen';

const initialStateId = stringGen(10);

const dummyResult = {
  inputs: [
    { slug: 'item-ore-iron', perMinute: 294.25 },
    { slug: 'item-ore-copper', perMinute: 249 },
    { slug: 'item-coal', perMinute: 136.25 },
    { slug: 'item-liquid-oil', perMinute: 117000 },
    { slug: 'item-stone', perMinute: 75 },
  ],
  recipes: [
    { slug: 'recipe-circuit-board', multiple: 2 },
    { slug: 'recipe-encased-industrial-beam', multiple: 0.8333333134651184 },
    { slug: 'recipe-iron-plate-reinforced', multiple: 1.5 },
    { slug: 'recipe-modular-frame', multiple: 2.5 },
    { slug: 'recipe-stator', multiple: 1.5 },
    { slug: 'recipe-cable', multiple: 5.300000011920929 },
    { slug: 'recipe-concrete', multiple: 1.6666666865348816 },
    { slug: 'recipe-copper-sheet', multiple: 3 },
    { slug: 'recipe-iron-plate', multiple: 2.25 },
    { slug: 'recipe-iron-rod', multiple: 6.033333361148834 },
    { slug: 'recipe-screw', multiple: 6.050000011920929 },
    { slug: 'recipe-steel-beam', multiple: 1.3333333134651184 },
    { slug: 'recipe-steel-pipe', multiple: 1.875 },
    { slug: 'recipe-wire', multiple: 12.600000023841858 },
    { slug: 'recipe-computer', multiple: 0.3999999761581421 },
    { slug: 'recipe-modular-frame-heavy', multiple: 0.5 },
    { slug: 'recipe-plastic', multiple: 3.899999976158142 },
    { slug: 'recipe-residual-fuel', multiple: 0.6499999761581421 },
    { slug: 'recipe-ingot-copper', multiple: 8.300000011920929 },
    { slug: 'recipe-ingot-iron', multiple: 5.266666650772095 },
    { slug: 'recipe-ingot-steel', multiple: 3.0277777910232544 },
    { slug: 'recipe-space-elevator-part-3', multiple: 3 },
    { slug: 'recipe-space-elevator-part-5', multiple: 1 },
  ],
  outputs: [{ slug: 'item-space-elevator-part-5', perMinute: 1 }],
  residuals: [{ slug: 'item-liquid-fuel', perMinute: 26000 }],
  removableRecipes: ['recipe-residual-fuel'],
  removableResiduals: ['item-liquid-fuel'],
  removableInputs: [],
};

export const graphWizardStore = new Store({
  boxes: [initialStateId],
  products: {
    [initialStateId]: { slug: 'item-space-elevator-part-5', amount: 1 },
  },
  result: dummyResult || {},
  constraints: {},
  autoCalculate: false,
});

export const graphAppStore = new Store({
  graphFidelity: 'high',
  graphData: {
    edges: [] as SatisGraphtoryEdge[],
    nodes: [] as SatisGraphtoryNode[],
  },
  initialLoadedData: null,
  mouseMode: 'move',
  selectedMachine: null,
  openModals: 0,
  placeableMachineClasses: [],
});
