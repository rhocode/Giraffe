import GroupNode from '../../datatypes/graph/groupNode';
import SatisGraphtoryLoopableNode from '../../datatypes/satisgraphtory/satisGraphtoryLoopableNode';
import SatisGraphtoryAbstractNode from '../../datatypes/satisgraphtory/satisGraphtoryAbstractNode';
import Belt from '../../datatypes/satisgraphtory/belt';

type Nullable<T> = T | null;

const processLoop = (group: GroupNode) => {
  const nodeSet: Set<SatisGraphtoryLoopableNode> = new Set(
    group.subNodes.map(node => {
      if (!(node instanceof SatisGraphtoryLoopableNode)) {
        throw new Error('Not an instance of a SG Abstract node');
      }
      return node as SatisGraphtoryLoopableNode;
    })
  );

  const sources: Set<SatisGraphtoryLoopableNode> = new Set();
  const targets: Set<SatisGraphtoryLoopableNode> = new Set();
  const externalSources: Set<SatisGraphtoryLoopableNode> = new Set();
  const externalTargets: Set<SatisGraphtoryLoopableNode> = new Set();
  const circularTargets: Set<SatisGraphtoryLoopableNode> = new Set();

  group.subNodes.forEach(node => {
    const incoming = Array.from(node.inputs.values()).map(
      item => item as SatisGraphtoryLoopableNode
    );

    if (incoming.length > 1) {
      circularTargets.add(node as SatisGraphtoryLoopableNode);
    }

    const incomingNotInSet = incoming.filter(node => !nodeSet.has(node));

    if (incomingNotInSet.length > 0) {
      // console.log('Contains external input!');
      sources.add(node as SatisGraphtoryLoopableNode);
      incomingNotInSet.forEach(item => externalSources.add(item));
    }

    const outgoing = Array.from(node.outputs.values()).map(
      item => item as SatisGraphtoryLoopableNode
    );
    const outgoingNotInSet = outgoing.filter(node => !nodeSet.has(node));

    if (outgoingNotInSet.length > 0) {
      // console.log('Contains external input!');
      targets.add(node as SatisGraphtoryLoopableNode);
      outgoingNotInSet.forEach(item => externalTargets.add(item));
    }
  });

  //1. Process all sources, with the externalSources (propagate their edges into the nodes within this grpah.

  const queue: Array<SatisGraphtoryAbstractNode> = [];
  const parentQueue: Array<SatisGraphtoryAbstractNode> = [];
  const processed: Map<
    SatisGraphtoryAbstractNode,
    Nullable<SatisGraphtoryAbstractNode>
  > = new Map();

  sources.forEach(sourceNode => {
    sourceNode.processPresentInputs(externalSources);
    queue.push(sourceNode);
  });

  while (queue.length) {
    const popped = queue.shift();
    const poppedParent = parentQueue.shift() || null;
    if (popped === undefined) {
      throw new Error("Somehow the queue length was defined but now it isn't");
    }

    if (!processed.has(popped)) {
      processed.set(popped, poppedParent);

      // do some processing
      popped.distributeOutputs();
      //then continue

      Array.from(popped.outputs.entries())
        .filter(entry => {
          const item = entry[1];
          const belt = entry[0];
          return (
            item instanceof SatisGraphtoryLoopableNode && belt instanceof Belt
          );
        })
        .forEach(entry => {
          const belt = entry[0] as Belt;
          const node = entry[1] as SatisGraphtoryLoopableNode;

          if (nodeSet.has(node)) {
            if (!processed.has(node)) {
              queue.push(node);
              parentQueue.push(popped);
            } else {
              // console.error('VISITED!d!!d');
            }
          } else {
            // it's an external node. we need to track its output! or not maybe, you can do the diff from output's inputs
            // with the current node set
          }
        });
    }
  }

  Array.from(externalTargets)
    .map(target => {
      return Array.from(target.inputs.entries());
    })
    .flat(1)
    .map(entry => {
      const belt = entry[0];
      const node = entry[1];
      console.error(belt, entry);
    });

  //2. Do a bfs using ALL sources, while propagating the resources via edges. Keep track of already visited note
  // instances with the EDGES!!!! (and keep track of what each "PARENT" edge is to each item.
  //3. Look at external output, calculate ratios with respect to each other.
  //4. For each intersecting EDGE, look at it's carry. Look at existing input to see what the ratio is
  // say, incoming is 0.5. If none exists, the ratio is 1.
  //5. Then, for each output, look at the ratio (0.5/0.75) and then multiply it by the incoming (0.5 from above)
  // and finally by the amount the new edge would have brought in (say, 0.25)
  // keep an external ratio!
  // If we have MULTI COMMODITY AND one of the propagators become overloaded, kill myself.
  // Also ensure that belt speeds are the same for every output!!!!!!!
};

export default processLoop;
