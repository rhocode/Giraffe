import { GraphObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import { getSchemaForVersion } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/serialization/schema';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import {
  serializeEdge,
  serializeNode,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/serialization/types';
import { deflateRaw } from 'pako';
import * as LZ from 'lz-string';
import { buffer2str } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/serialization/stringEncode';

const serializeGraphObjects = (objects: GraphObject[]) => {
  let checksumGraph = getSerializedGraph(
    objects.slice().sort((a, b) => {
      return a.id.localeCompare(b.id);
    })
  );

  const serializedGraph = getSerializedGraph(objects);

  let hash = 0,
    i,
    chr;
  for (i = 0; i < checksumGraph.d.length; i++) {
    chr = checksumGraph.d.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return {
    ...serializedGraph,
    h: hash,
  };
};

const getSerializedGraph = (objects: GraphObject[]) => {
  // const edgesToProcess: EdgeTemplate[] = [];
  const nodeIdToNumberMap = new Map<string, number>();
  const edgeIdToNumberMap = new Map<string, number>();

  // Reference to a number so we can edit it inside a function
  let nodeNumberId = [1];
  let edgeNumberId = [1];

  const root = getSchemaForVersion(process.env.REACT_APP_VERSION || '');

  const NodeType = root.lookupType('Node');

  const EdgeType = root.lookupType('Edge');

  const nodes = [];
  const edges = [];

  for (const obj of objects) {
    if (obj instanceof NodeTemplate) {
      for (const edge of [
        ...obj.anyConnections,
        ...obj.outputConnections,
        ...obj.inputConnections,
      ]) {
        if (!edgeIdToNumberMap.has(edge.id)) {
          const serializedEdge = serializeEdge(
            edge,
            nodeIdToNumberMap,
            edgeIdToNumberMap,
            nodeNumberId,
            edgeNumberId,
            EdgeType
          );

          edges.push(serializedEdge);
        }
      }

      const serializedNode = serializeNode(
        obj,
        nodeIdToNumberMap,
        edgeIdToNumberMap,
        nodeNumberId,
        edgeNumberId,
        NodeType
      );

      nodes.push(serializedNode);

      // const buffer1 = EdgeType.encode(serializedNode).finish();
      // const message1 = EdgeType.decode(buffer1);
      // console.log(EdgeType.toObject(message1, {
      //   enums: String,  // enums as string names
      //   longs: String,  // longs as strings (requires long.js)
      //   bytes: String,  // bytes as base64 encoded strings
      //   defaults: true, // includes default values
      //   arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
      //   objects: true,  // populates empty objects (map fields) even if defaults=false
      //   oneofs: true    // includes virtual oneof fields set to the present field's name
      // }));
    } else if (obj instanceof EdgeTemplate) {
      // edgesToProcess.push(obj);
      // ignore
      // const serializedEdge = serializeEdge(
      //   obj,
      //   nodeIdToNumberMap,
      //   edgeIdToNumberMap,
      //   nodeNumberId,
      //   edgeNumberId,
      //   EdgeType
      // );
      //
      // edges.push(serializedEdge);
      //
      // const buffer1 = EdgeType.encode(serializedEdge).finish();
      // const message1 = EdgeType.decode(buffer1);
      // console.log(EdgeType.toObject(message1, {
      //   enums: String,  // enums as string names
      //   longs: String,  // longs as strings (requires long.js)
      //   bytes: String,  // bytes as base64 encoded strings
      //   defaults: true, // includes default values
      //   arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
      //   objects: true,  // populates empty objects (map fields) even if defaults=false
      //   oneofs: true    // includes virtual oneof fields set to the present field's name
      // }));
    } else {
      console.log(obj);
      throw new Error('Unimplemented serialization');
    }
  }

  const SaveData = root.lookupType('SGSave');

  const saveDataBase = {
    nodes,
    edges,
  };

  SaveData.verify(saveDataBase);
  // console.log(SaveData.create(saveDataBase));

  const data = SaveData.encode(saveDataBase).finish();

  const textForm = buffer2str(data, false);

  let compressedUint8Form = LZ.compressToUint8Array(textForm);

  let dataLength = compressedUint8Form.length;
  let compressionLevel = 0;

  for (let i = 0; i < 50; i++) {
    const newData = deflateRaw(compressedUint8Form, { level: 9 });
    if (newData.length < dataLength) {
      compressedUint8Form = newData;
      dataLength = newData.length;
      compressionLevel++;
    } else {
      break;
    }
  }

  const tmp = buffer2str(compressedUint8Form, false);

  const stringForm = LZ.compressToBase64(tmp);

  //
  // console.log('Your save code:');
  // console.log(JSON.stringify(finalData, null, 2));

  return {
    d: stringForm,
    c: compressionLevel,
    v: process.env.REACT_APP_VERSION,
  };
};

export default serializeGraphObjects;
