import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import { buildingEnums, recipeEnums } from 'data/protobuf/protobufEnums';

// const serializeNode = (node: NodeTemplate) => {
//
// }

const getOrCreateId = (
  id: string,
  map: Map<string, number>,
  currentId: number[]
) => {
  if (!map.has(id)) {
    map.set(id, currentId[0]);
    currentId[0]++;
  }

  return map.get(id)!;
};

export const serializeEdge = (
  edge: EdgeTemplate,
  nodeIdToNumberMap: Map<string, number>,
  edgeIdToNumberMap: Map<string, number>,
  nodeNumberId: number[],
  edgeNumberId: number[],
  edgeSerializer: any
) => {
  const { sourceNode, targetNode } = edge;

  let sourceNodeId, targetNodeId;

  if (sourceNode) {
    sourceNodeId = getOrCreateId(
      sourceNode.id,
      nodeIdToNumberMap,
      nodeNumberId
    );
  }

  if (targetNode) {
    targetNodeId = getOrCreateId(
      targetNode.id,
      nodeIdToNumberMap,
      nodeNumberId
    );
  }

  // TODO: optimize the edges,
  // TODO: only serialize one of the two source or
  //  target nodes, saving a number slot since we can infer them

  // TODO: if all these are defaults then don't include them? we can ignore something if it has roots in
  // inputConnections and outputConnections
  const baseObject = {
    id: getOrCreateId(edge.id, edgeIdToNumberMap, edgeNumberId),
    sourceNodeId,
    targetNodeId,
    resourceForm: edge.resourceForm,
    biDirectional: edge.biDirectional,
    sourceNodeAttachmentSide: edge.sourceNodeAttachmentSide,
    targetNodeAttachmentSide: edge.targetNodeAttachmentSide,
  };

  edgeSerializer.verify(baseObject);

  return edgeSerializer.create(baseObject);
};

const getNumberFromEnum = (
  key: string,
  enumStore: Record<string | number, string | number>
) => {
  if (key === '') return 0;

  const enumNumber = enumStore[key];

  if (enumNumber === undefined) {
    throw new Error('No enum defined for key ' + key);
  }

  if (typeof enumNumber !== 'number') {
    throw new Error(
      'Key ' + key + ' was used to retrieve non-number value ' + enumNumber
    );
  }

  return enumNumber;
};

export const serializeNode = (
  node: NodeTemplate,
  nodeIdToNumberMap: Map<string, number>,
  edgeIdToNumberMap: Map<string, number>,
  nodeNumberId: number[],
  edgeNumberId: number[],
  nodeSerializer: any
) => {
  const baseObject = {
    id: getOrCreateId(node.id, nodeIdToNumberMap, nodeNumberId),
    recipeId: getNumberFromEnum(node.recipe, recipeEnums),
    overclock: node.overclock,
    inputs: node.inputConnections.map((connection) =>
      getOrCreateId(connection.id, edgeIdToNumberMap, edgeNumberId)
    ),
    outputs: node.outputConnections.map((connection) =>
      getOrCreateId(connection.id, edgeIdToNumberMap, edgeNumberId)
    ),
    any: node.anyConnections.map((connection) =>
      getOrCreateId(connection.id, edgeIdToNumberMap, edgeNumberId)
    ),
    machineTypeId: getNumberFromEnum(node.machineName, buildingEnums),
    x: node.container.x,
    y: node.container.y,
    tier: node.tier,
  };

  nodeSerializer.verify(baseObject);

  return nodeSerializer.create(baseObject);
};
