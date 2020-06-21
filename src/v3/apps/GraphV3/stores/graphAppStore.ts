import { Store } from 'pullstate';
import {
  SatisGraphtoryEdge,
  SatisGraphtoryNode
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';

export const graphAppStore = new Store({
  graphFidelity: 'high',
  graphData: {
    edges: [] as SatisGraphtoryEdge[],
    nodes: [] as SatisGraphtoryNode[]
  },
  initialLoadedData: null,
  mouseMode: 'move',
  selectedMachine: null,
  openModals: 0,
  placeableMachineClasses: []
});
