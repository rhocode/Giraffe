import { getSchemaForVersion } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/serialization/schema';
import { inflateRaw } from 'pako';
import * as LZ from 'lz-string';
import { str2buffer } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/serialization/stringEncode';
import { EmptyEdge } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EmptyEdge';
import uuidGen from 'v3/utils/stringUtils';
import AdvancedNode from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/AdvancedNode';
import { getBuildingName, getTier } from 'v3/data/loaders/buildings';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import SimpleEdge from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/SimpleEdge';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import { GraphObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import ExternalInteractionManager from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/ExternalInteractionManager';

const deserializeGraphObjects = (
  data: any,
  translateFunction: any,
  externalInteractionManager: ExternalInteractionManager
) => {
  // Decompression
  const root = getSchemaForVersion(data.v);

  let encodedDecompress = LZ.decompressFromBase64(data.d)!;

  let dataEncoded = str2buffer(encodedDecompress, false);

  for (let i = 0; i < data.c; i++) {
    dataEncoded = inflateRaw(dataEncoded);
  }

  let decompressedUint8Form = LZ.decompressFromUint8Array(dataEncoded);

  const bufferForm = str2buffer(decompressedUint8Form, false);

  const SaveData = root.lookupType('SGSave');
  const saveDataDecoded = SaveData.toObject(SaveData.decode(bufferForm), {
    enums: String, // enums as string names
    arrays: true, // populates empty arrays (repeated fields) even if defaults=false
  });

  console.log('Deserialized data', saveDataDecoded);

  const displayableChildren: GraphObject[] = [];

  const edgeNumberToId = new Map<number, string>();
  const edgeNumberToInstance = new Map<number, EdgeTemplate>();

  const nodeNumberToId = new Map<number, string>();
  const nodeNumberToInstance = new Map<number, NodeTemplate>();

  for (const edge of saveDataDecoded.edges) {
    const thisUuid = uuidGen();
    edgeNumberToId.set(edge.id, thisUuid);

    // const targetNode = edge.targetNodeId? nodeNumberToId.get(edge.targetNodeId) : undefined;
    // const sourceNode = edge.sourceNodeId? nodeNumberToId.get(edge.sourceNodeId) : undefined;

    if (!edge.connectorTypeId) {
      const emptyEdge = new EmptyEdge({
        id: thisUuid,
        sourceNodeAttachmentSide: edge.sourceNodeAttachmentSide,
        targetNodeAttachmentSide: edge.targetNodeAttachmentSide,
        biDirectional: edge.biDirectional,
        resourceForm: edge.resourceForm,
        externalInteractionManager,
      });
      edgeNumberToInstance.set(edge.id, emptyEdge);
    } else {
      const populatedEdge = new SimpleEdge({
        id: thisUuid,
        sourceNodeAttachmentSide: edge.sourceNodeAttachmentSide,
        targetNodeAttachmentSide: edge.targetNodeAttachmentSide,
        biDirectional: edge.biDirectional,
        resourceForm: edge.resourceForm,
        ignoreLinking: true,
        connectorName: edge.connectorTypeId,
        externalInteractionManager,
      });
      edgeNumberToInstance.set(edge.id, populatedEdge);
      displayableChildren.push(populatedEdge);
    }
  }

  // First stub a node id
  for (const node of saveDataDecoded.nodes) {
    const thisUuid = uuidGen();
    nodeNumberToId.set(node.id, thisUuid);

    const {
      recipeId: recipe,
      x,
      y,
      machineTypeId: buildingSlug,
      overclock,
    } = node;

    const populatedNode = new AdvancedNode({
      position: {
        x,
        y,
      },
      id: thisUuid,
      recipeLabel: recipe ? translateFunction(recipe) : '',
      recipeName: recipe ? recipe : '',
      tier: getTier(buildingSlug),
      overclock,
      machineName: buildingSlug,
      machineLabel: getBuildingName(buildingSlug) as string,
      inputConnections: node.inputs.map((num: number) => {
        if (!edgeNumberToInstance.get(num))
          throw new Error('Unresolved edge number ' + num);
        return edgeNumberToInstance.get(num)!;
      }),
      outputConnections: node.outputs.map((num: number) => {
        if (!edgeNumberToInstance.get(num))
          throw new Error('Unresolved edge number ' + num);
        return edgeNumberToInstance.get(num)!;
      }),
      anyConnections: node.any.map((num: number) => {
        if (!edgeNumberToInstance.get(num))
          throw new Error('Unresolved edge number ' + num);
        return edgeNumberToInstance.get(num)!;
      }),
      externalInteractionManager,
    });

    nodeNumberToInstance.set(node.id, populatedNode);
    displayableChildren.push(populatedNode);
  }

  // Final pass through to resolve the target and source nodes
  for (const edge of saveDataDecoded.edges) {
    const populatedEdge = edgeNumberToInstance.get(edge.id);

    if (!populatedEdge) throw new Error('Undefined edge with id ' + edge.id);
    if (edge.targetNodeId && !nodeNumberToInstance.get(edge.targetNodeId))
      throw new Error(
        'Node ' + edge.id + ' has invalid targetId ' + edge.targetNodeId
      );
    if (edge.sourceNodeId && !nodeNumberToInstance.get(edge.sourceNodeId))
      throw new Error(
        'Node ' + edge.id + ' has invalid sourceId ' + edge.sourceNodeId
      );
    populatedEdge.sourceNode = edge.sourceNodeId
      ? nodeNumberToInstance.get(edge.sourceNodeId)!
      : null;
    populatedEdge.targetNode = edge.targetNodeId
      ? nodeNumberToInstance.get(edge.targetNodeId)!
      : null;

    populatedEdge.updateWithoutHitBox();
  }

  // Final pass through for nodes to recalculate their edges
  for (const node of saveDataDecoded.nodes) {
    const populatedNode = nodeNumberToInstance.get(node.id);

    if (!populatedNode) throw new Error('Undefined edge with id ' + node.id);
    populatedNode.recalculateConnections();
  }

  return displayableChildren;
};

export default deserializeGraphObjects;
