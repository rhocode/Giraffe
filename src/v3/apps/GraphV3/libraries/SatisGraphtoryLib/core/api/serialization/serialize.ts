import { GraphObject } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/interfaces/GraphObject';
import { getSchemaForVersion } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/serialization/schema';
import { NodeTemplate } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Node/NodeTemplate';
import EdgeTemplate from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/canvas/objects/Edge/EdgeTemplate';
import {
  serializeEdge,
  serializeNode,
} from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/core/api/serialization/types';
import { deflateRaw } from 'pako';

export function base64ArrayBuffer(bytes: Uint8Array) {
  let base64 = '';
  const encodings =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;

  let a;
  let b;
  let c;
  let d;
  let chunk;

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i += 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1

    base64 += `${encodings[a]}${encodings[b]}==`;
  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1

    base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`;
  }

  return base64;
}

const serializeGraphObjects = (objs: GraphObject[]) => {
  // const edgesToProcess: EdgeTemplate[] = [];
  const nodeIdToNumberMap = new Map<string, number>();
  const edgeIdToNumberMap = new Map<string, number>();

  // Reference to a number so we can edit it inside a function
  let nodeNumberId = [1];
  let edgeNumberId = [1];

  const root = getSchemaForVersion('1.0.0');

  console.log(root);

  const NodeType = root.lookupType('Node');

  const EdgeType = root.lookupType('Edge');
  //
  // // Exemplary payload
  // const payload = {id: 2, itemEnum: 1, inputs: [1, 2, 3]};
  //
  //
  // const message2 = NodeType.create(payload); // or use .fromObject if conversion is necessary
  //
  //
  // const buffer = NodeType.encode(message2).finish();
  // // ... do something with buffer
  // //
  // // // Decode an Uint8Array (browser) or Buffer (node) to a message
  // const message3 = NodeType.decode(buffer);
  //
  //
  //
  // const compressed = compressSync(buffer, { level: 9, mem: 12 })
  // //
  // // console.log(message3, buffer, compressed);
  // //
  // const derp2 = NodeType.toObject(message3, {
  //   enums: String,  // enums as string names
  //   longs: String,  // longs as strings (requires long.js)
  //   bytes: String,  // bytes as base64 encoded strings
  //   defaults: true, // includes default values
  //   arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
  //   objects: true,  // populates empty objects (map fields) even if defaults=false
  //   oneofs: true    // includes virtual oneof fields set to the present field's name
  // });
  //
  // console.log(derp2);

  console.log('AAAA');

  const nodes = [];
  const edges = [];

  for (const obj of objs) {
    if (obj instanceof NodeTemplate) {
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
      const serializedEdge = serializeEdge(
        obj,
        nodeIdToNumberMap,
        edgeIdToNumberMap,
        nodeNumberId,
        edgeNumberId,
        EdgeType
      );

      edges.push(serializedEdge);

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
      throw new Error('Unimplemented serialization');
    }
  }

  const SaveData = root.lookupType('SGSave');

  const saveDataBase = {
    nodes,
    edges,
  };

  SaveData.verify(saveDataBase);
  SaveData.create(saveDataBase);
  // const message1 = SaveData.decode(buffer);
  // console.log(SaveData.toObject(message1, {
  //   enums: String,  // enums as string names
  //   longs: String,  // longs as strings (requires long.js)
  //   bytes: String,  // bytes as base64 encoded strings
  //   defaults: true, // includes default values
  //   arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
  //   objects: true,  // populates empty objects (map fields) even if defaults=false
  //   oneofs: true    // includes virtual oneof fields set to the present field's name
  // }));
  let data = SaveData.encode(saveDataBase).finish();
  let dataLength = data.length;
  let compressionLevel = 0;
  for (let i = 0; i < 50; i++) {
    const newData = deflateRaw(data, { level: 9 });
    if (newData.length < dataLength) {
      data = newData;
      dataLength = newData.length;
      compressionLevel++;
    } else {
      break;
    }
  }

  console.log(base64ArrayBuffer(data));

  return { data, compressionLevel };
};

export default serializeGraphObjects;
