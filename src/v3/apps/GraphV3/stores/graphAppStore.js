import { Store } from 'pullstate';

export const graphAppStore = new Store({
  graphFidelity: 'high',
  graphData: {
    edges: [],
    nodes: []
  },
  initialLoadedData: null
});
