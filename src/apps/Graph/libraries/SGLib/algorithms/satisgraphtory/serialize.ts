import * as protobuf from 'protobufjs/light';
import { GraphNode } from '../../datatypes/graph/graphNode';
import { b64fromBuffer } from '@waiting/base64';
import * as LZUTF8 from 'lzutf8';
import { GraphEdge } from '../../datatypes/graph/graphEdge';
import { getLatestSchemaName } from '../../utils/getLatestSchema';

const baseChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const lookup: string[] = [];

for (let i = 0, len = baseChars.length; i < len; ++i) {
  lookup[i] = baseChars[i];
}

export type saveFile = {
  edges: GraphEdge[];
  nodes: GraphNode[];
};

function toString(num: number) {
  let numStr = String(num);

  if (Math.abs(num) < 1.0) {
    let e = parseInt(num.toString().split('e-')[1]);
    if (e) {
      let negative = num < 0;
      if (negative) num *= -1;
      num *= Math.pow(10, e - 1);
      numStr = '0.' + new Array(e).join('0') + num.toString().substring(2);
      if (negative) numStr = '-' + numStr;
    }
  } else {
    let e = parseInt(num.toString().split('+')[1]);
    if (e > 20) {
      e -= 20;
      num /= Math.pow(10, e);
      numStr = num.toString() + new Array(e + 1).join('0');
    }
  }

  return numStr;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const serializeNode = (
  node: GraphNode,
  serializer: any,
  enumMapper: any,
  flagger: any
) => {
  const data: any = node.serialize();

  console.log(data);

  const mappedEnums: any = {};

  Object.keys(enumMapper).forEach(fieldName => {
    const fetchedData = data[fieldName];

    if (fetchedData !== null && fetchedData !== undefined) {
      mappedEnums[fieldName] = enumMapper[fieldName](fetchedData);

      const flagFieldName = flagger[fieldName];
      if (flagFieldName !== null && flagFieldName !== undefined) {
        mappedEnums[flagFieldName] = true;
      }
    } else {
      const flagFieldName = flagger[fieldName];
      mappedEnums[flagFieldName] = false;
    }
  });

  const finalMapping = Object.assign({}, data, mappedEnums);

  const verify = serializer.verify(finalMapping);

  if (verify) {
    throw new Error('Serializer error: ' + verify);
  }

  console.log(finalMapping);

  return finalMapping;
};

const serializeEdgesFromNodes = (nodes: GraphNode[], enumMapper: any) => {
  const sourceEdgeIndexMap: Map<GraphEdge, number> = new Map();
  const targetEdgeIndexMap: Map<GraphEdge, number> = new Map();

  nodes.forEach(node => {
    node.inputSlots.forEach((possibleEdge, index) => {
      if (possibleEdge instanceof GraphEdge) {
        targetEdgeIndexMap.set(possibleEdge, index);
      }
    });

    node.outputSlots.forEach((possibleEdge, index) => {
      if (possibleEdge instanceof GraphEdge) {
        sourceEdgeIndexMap.set(possibleEdge, index);
      }
    });
  });

  const allEdges: any = [];

  Array.from(sourceEdgeIndexMap.entries()).forEach(entry => {
    const edge = entry[0];
    if (targetEdgeIndexMap.has(edge)) {
      const retrieval = targetEdgeIndexMap.get(edge);

      if (retrieval === undefined) {
        throw new Error('Undefined retrieval of edge');
      }

      const index = entry[1];

      const edgeSerialized: any = edge.serialize();

      const mappedEnums: any = {};

      Object.keys(enumMapper).forEach(fieldName => {
        const fetchedData = edgeSerialized[fieldName];

        if (fetchedData !== null && fetchedData !== undefined) {
          mappedEnums[fieldName] = enumMapper[fieldName](fetchedData);
        }
      });

      allEdges.push(
        Object.assign(
          {},
          edgeSerialized,
          {
            sourceIndex: index,
            targetIndex: retrieval
          },
          mappedEnums
        )
      );
    }
  });

  return allEdges;
};

const dataMapper = (root: any, enumName: string) => {
  const classData = root.lookupEnum(enumName);

  return {
    toEnum: (data: string) => classData.values[data],
    fromEnum: (enm: number) => classData.valuesById[enm]
  };
};

const serialize = (schema: any, graph: saveFile) => {
  const root = protobuf.Root.fromJSON(schema);

  const Node = root.lookupType('Node');
  // const Edge = root.lookupType('Edge');

  const MachineClass = dataMapper(root, 'MachineClass');
  const UpgradeTiers = dataMapper(root, 'UpgradeTiers');
  const Recipe = dataMapper(root, 'Recipe');

  const nodes = graph.nodes;

  const nodeEnumMapper = {
    machineClass: MachineClass.toEnum,
    recipe: Recipe.toEnum,
    tier: UpgradeTiers.toEnum
  };

  const nodeEnumFlagger = {
    recipe: 'hasRecipe'
  };

  const serializedNodes = nodes.map(node =>
    serializeNode(node, Node, nodeEnumMapper, nodeEnumFlagger)
  );

  const edgeEnumMapper = {
    tier: UpgradeTiers.toEnum
  };

  const serializedEdges = serializeEdgesFromNodes(nodes, edgeEnumMapper);
  // We must serialize the edges from the nodes, since in the future we may only
  // need to serialize portions of the nodes + edges.

  console.log(serializedEdges);

  const SaveFile = root.lookupType('SaveFile');
  const buffer = SaveFile.encode({
    edges: serializedEdges,
    nodes: serializedNodes
  }).finish();

  let num_iterations = 0;
  let lastSize = Infinity;
  let thisSize = Infinity;

  let currentBuffer = buffer;

  do {
    const encodedText = b64fromBuffer(currentBuffer);
    currentBuffer = LZUTF8.compress(encodedText);

    lastSize = thisSize;
    thisSize = encodedText.length;
    num_iterations++;
  } while (thisSize < lastSize);

  const originalJSON = JSON.stringify({
    edges: serializedEdges,
    nodes: serializedNodes
  });

  console.log('Total JSON size: ' + formatBytes(originalJSON.length * 8));
  console.log(
    'Total serialized size: ' + formatBytes(currentBuffer.length * 8)
  );
  console.log('Adding this would cost $' + toString(0.05 / 10000));
  console.log('Updating this would cost $' + toString(0.05 / 10000));
  console.log(
    'Storing this per month would cost $' +
      toString((currentBuffer.length / 1000000000) * 0.12)
  );
  const num_reads = 2000;
  console.log(
    'Assuming ' +
      num_reads +
      ' reads $' +
      toString((0.0004 / 10000) * num_reads)
  );
  console.log(
    'Which means this can be read ' +
      toString(1 / (0.0004 / 10000)) +
      ' times for $1'
  );
  return {
    d: b64fromBuffer(currentBuffer),
    i: num_iterations,
    v: getLatestSchemaName()
  };
};

export default serialize;
