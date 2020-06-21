// This file defines the api methods that can be called from the main package.
import {
  SatisGraphtoryNode,
  SatisGraphtoryNodePosition
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import { graphAppStore } from 'v3/apps/GraphV3/stores/graphAppStore';

export const addNode = (
  newNode: SatisGraphtoryNode,
  position: SatisGraphtoryNodePosition
) => {
  graphAppStore.update(s => {
    s.graphData.nodes.push(newNode);
  });
};

export const addEdge = (sourceNodeId: string, targetNodeId: string) => {
  graphAppStore.update(s => {
    // s.graphData.edges.push();
  });
};
