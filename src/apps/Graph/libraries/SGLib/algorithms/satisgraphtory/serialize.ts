import * as protobuf from 'protobufjs/light';
import { GraphNode } from '../../datatypes/graph/graphNode';

type saveFile = {
  edges: any;
  nodes: any;
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

// const serializeNode = (node: GraphNode) => {
//     const data = node.serialize();
//     data.
// }

const serialize = (schema: any, graph: saveFile) => {
  const root = protobuf.Root.fromJSON(schema);

  const Node = root.lookupType('Node');
  const Edge = root.lookupType('Edge');

  const MachineClass = root.lookupEnum('MachineClass');
  const UpgradeTiers = root.lookupEnum('UpgradeTiers');

  const buffer = Node.encode({
    id: 10,
    class: 0,
    tier: 0,
    overclock: 0
  }).finish();

  console.error(buffer);

  console.log('Total serialized size: ' + formatBytes(buffer.length * 8));
  console.log('Adding this would cost $' + toString(0.05 / 10000));
  console.log('Updating this would cost $' + toString(0.05 / 10000));
  console.log(
    'Storing this per month would cost $' +
      toString((buffer.length / 1000000000) * 0.12)
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
};

export default serialize;
