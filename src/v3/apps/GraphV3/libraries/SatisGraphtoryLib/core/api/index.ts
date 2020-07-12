// This file defines the api methods that can be called from the main package.
import {
  SatisGraphtoryEdgeProps,
  SatisGraphtoryNodeProps,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/types';
import { graphAppStore } from 'v3/apps/GraphV3/stores/graphAppStore';

export const addNode = (newNode: SatisGraphtoryNodeProps) => {
  graphAppStore.update((s) => {
    s.graphData.nodes.set(newNode.nodeId, newNode);
  });
};

export const addEdge = (newEdge: SatisGraphtoryEdgeProps) => {
  graphAppStore.update((s) => {
    s.graphData.edges.set(newEdge.edgeId, newEdge);
  });
};
