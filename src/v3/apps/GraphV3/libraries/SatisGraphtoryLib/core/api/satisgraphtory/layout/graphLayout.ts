import { getMultiTypedChildrenFromState } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/canvas/childrenApi';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';

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
