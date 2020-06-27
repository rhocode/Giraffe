import { Store } from 'pullstate';
import {
  SatisGraphtoryEdge,
  SatisGraphtoryNode,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import stringGen from 'v3/utils/stringGen';

export const graphWizardStore = new Store({
  products: [{ id: stringGen(10), slug: null, amount: 1 }],
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
