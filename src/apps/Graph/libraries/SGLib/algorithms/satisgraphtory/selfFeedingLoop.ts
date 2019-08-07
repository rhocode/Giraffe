import GroupNode from '../../datatypes/graph/groupNode';
import SatisGraphtoryLoopableNode from '../../datatypes/satisgraphtory/satisGraphtoryLoopableNode';

const processLoop = (group: GroupNode) => {
  const nodeSet: Set<SatisGraphtoryLoopableNode> = new Set(
    group.subNodes.map(node => {
      if (!(node instanceof SatisGraphtoryLoopableNode)) {
        throw new Error('Not an instance of a SG Abstract node');
      }
      return node as SatisGraphtoryLoopableNode;
    })
  );

  const sources: Array<SatisGraphtoryLoopableNode> = [];
  const targets: Array<SatisGraphtoryLoopableNode> = [];
  const externalSources: Set<SatisGraphtoryLoopableNode> = new Set();
  const externalTargets: Set<SatisGraphtoryLoopableNode> = new Set();

  group.subNodes.forEach(node => {
    const incoming = Array.from(node.inputs.values()).map(
      item => item as SatisGraphtoryLoopableNode
    );
    const incomingNotInSet = incoming.filter(node => !nodeSet.has(node));

    if (incomingNotInSet.length > 0) {
      console.log('Contains external input!');
      sources.push(node as SatisGraphtoryLoopableNode);
      incomingNotInSet.forEach(item => externalSources.add(item));
    }

    const outgoing = Array.from(node.outputs.values()).map(
      item => item as SatisGraphtoryLoopableNode
    );
    const outgoingNotInSet = outgoing.filter(node => !nodeSet.has(node));

    if (outgoingNotInSet.length > 0) {
      console.log('Contains external input!');
      targets.push(node as SatisGraphtoryLoopableNode);
      outgoingNotInSet.forEach(item => externalTargets.add(item));
    }
  });

  //1. Process all sources, with the externalSources (propagate their edges into the nodes.
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
