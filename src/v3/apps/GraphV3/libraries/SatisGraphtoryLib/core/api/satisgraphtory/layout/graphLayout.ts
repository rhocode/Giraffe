import { getMultiTypedChildrenFromState } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas/childrenApi';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import AdvancedNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/AdvancedNode';

export const shuffleNode = (node: AdvancedNode) => {
  node.optimizeSides();
  node.rearrangeEdges(node.outputConnections);
  node.rearrangeEdges(node.inputConnections);
  node.rearrangeEdges(node.anyConnections);
};

export const shuffleEdges = (edges: EdgeTemplate[]) => {
  edges.forEach((child) => {
    child.update();
  });
};

export const optimizeSidesFunction = (
  pixiCanvasStateId: string,
  whitelistedNodes = new Set<string>()
) => (sParent: any) => {
  const s = sParent[pixiCanvasStateId];

  for (const child of getMultiTypedChildrenFromState(
    s,
    [NodeTemplate],
    whitelistedNodes
  )) {
    child.optimizeSides();
  }
};

export const rearrangeEdgesFunction = (
  pixiCanvasStateId: string,
  whitelistedNodes = new Set<string>()
) => (sParent: any) => {
  const s = sParent[pixiCanvasStateId];
  for (const child of getMultiTypedChildrenFromState(
    s,
    [NodeTemplate],
    whitelistedNodes
  )) {
    child.rearrangeEdges(child.outputConnections);
    child.rearrangeEdges(child.inputConnections);
    child.rearrangeEdges(child.anyConnections);
  }
};

export const updateChildrenFunction = (
  pixiCanvasStateId: string,
  whitelistedNodes = new Set<string>()
) => (sParent: any) => {
  const s = sParent[pixiCanvasStateId];

  for (const child of getMultiTypedChildrenFromState(
    s,
    [EdgeTemplate],
    whitelistedNodes
  )) {
    child.update();
  }
};
