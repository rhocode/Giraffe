import GroupNode from '../../datatypes/graph/groupNode';
import SimpleNode from '../../datatypes/graph/simpleNode';
import HistoryFractionalEdge from '../../datatypes/graph/historyFractionalEdge';
import Belt from '../../datatypes/satisgraphtory/belt';
import SimpleEdge from '../../datatypes/graph/simpleEdge';

type Nullable<T> = T | null;

export const processLoopNew = (group: GroupNode) => {
  //0. TODO: clone graph first.

  //0. separate per input!
  const thisNodeSet: Set<SimpleNode> = new Set();
  const localNodeMapping: Map<SimpleNode, SimpleNode> = new Map();

  // TODO: replace this with the clone graph
  group.subNodes.forEach(node => {
    const cloneNode = new SimpleNode(node);
    thisNodeSet.add(cloneNode);
    localNodeMapping.set(node, cloneNode);
  });

  group.subNodes.forEach(node => {
    const thisCloneNode = localNodeMapping.get(node);
    if (thisCloneNode === undefined) {
      throw new Error('Should not be undefined');
    }

    Array.from(node.inputs.entries()).forEach(input => {
      const belt = input[0];

      const sourceNode = input[1];
      if (!localNodeMapping.has(sourceNode)) {
        const cloneNode = new SimpleNode(sourceNode);
        localNodeMapping.set(sourceNode, cloneNode);
      }

      const sourceCloneNode = localNodeMapping.get(sourceNode);
      if (sourceCloneNode === undefined) {
        throw new Error('Should not be undefined');
      }
      sourceCloneNode
        .addOutput(thisCloneNode, false, HistoryFractionalEdge)
        .setWeight(belt.weight)
        .setData(belt);
    });

    Array.from(node.outputs.entries()).forEach(input => {
      const belt = input[0];
      const targetNode = input[1];
      if (!localNodeMapping.has(targetNode)) {
        const cloneNode = new SimpleNode(targetNode);
        localNodeMapping.set(targetNode, cloneNode);
      }

      const targetCloneNode = localNodeMapping.get(targetNode);
      if (targetCloneNode === undefined) {
        throw new Error('Should not be undefined');
      }
      thisCloneNode
        .addOutput(targetCloneNode, false, HistoryFractionalEdge)
        .setWeight(0)
        .setData(belt);
    });
  });

  const independentInputEdges = Array.from(thisNodeSet)
    .map(node => {
      return Array.from(node.inputs.entries())
        .filter(item => {
          return !thisNodeSet.has(item[1]);
        })
        .map(item => item[0]);
    })
    .flat(1);

  const independentOutputEdges = Array.from(thisNodeSet)
    .map(node => {
      return Array.from(node.outputs.entries())
        .filter(item => {
          return !thisNodeSet.has(item[1]);
        })
        .map(item => item[0]);
    })
    .flat(1);

  const inputMax = Math.max(
    ...independentInputEdges.map(item => {
      const belt = item as HistoryFractionalEdge;

      return belt.fractionalWeight.toNumber();
    })
  );

  //todo: Ensure this number is actually nonzero and that fraction of time is possible!
  if (inputMax > 0 && independentOutputEdges.length == 0) {
    //todo: make this a visible error
    throw new Error('cycle is not propagatable');
  }

  independentInputEdges.forEach(edge => {
    const blackListedEdges = new Set(independentInputEdges);
    blackListedEdges.delete(edge);

    // if we see the other edges, we should ignore them.

    //1. Unwrap the graph.

    const queue: Array<SimpleNode> = [];
    const processed: Set<SimpleNode> = new Set();
    const parentEdge: Map<SimpleNode, SimpleEdge> = new Map();

    queue.push(edge.target);
    parentEdge.set(edge.target, edge);

    while (queue.length) {
      const popped = queue.shift();

      if (popped === undefined) {
        throw new Error(
          "Somehow the queue length was defined but now it isn't"
        );
      }

      // this node is not part of the internal set.
      if (!thisNodeSet.has(popped)) {
        continue;
      }

      if (!processed.has(popped)) {
        processed.add(popped);

        const sourceEdge = parentEdge.get(popped);

        if (sourceEdge === null) {
          throw new Error('the parent source was somehow null!!');
        }

        const sourceWeight = (sourceEdge as HistoryFractionalEdge)
          .fractionalWeight;

        console.error(sourceWeight);

        // ONLY for first iteration. ?
        Array.from(popped.outputs.entries()).forEach(entry => {
          const source = popped;
          const edge = entry[0];
          const target = entry[1];

          if (!parentEdge.has(target)) {
            parentEdge.set(target, edge);
          }
        });

        // popped.BLAH;

        Array.from(popped.outputs.entries()).forEach(entry => {
          const belt = entry[0];
          const node = entry[1];

          if (!processed.has(node)) {
            queue.push(node);
          }
        });
      }
    }
  });
};
//
// const processLoop = (group: GroupNode) => {
//   if (true) {
//     throw new Error("Loops are not supported currently.");
//   }
//
//   const thisNodeSet: Set<SatisGraphtoryLoopableNode> = new Set(
//     group.subNodes.map(node => {
//       if (!(node instanceof SatisGraphtoryLoopableNode)) {
//         throw new Error('Not an instance of a SG Abstract node');
//       }
//       return node as SatisGraphtoryLoopableNode;
//     })
//   );
//
//   const sources: Set<SatisGraphtoryLoopableNode> = new Set();
//   const targets: Set<SatisGraphtoryLoopableNode> = new Set();
//   const externalSources: Set<SatisGraphtoryLoopableNode> = new Set();
//   const externalTargets: Set<SatisGraphtoryLoopableNode> = new Set();
//   const circularTargets: Set<SatisGraphtoryLoopableNode> = new Set();
//   const incomingBelts: Set<Belt> = new Set();
//
//   group.subNodes.forEach(node => {
//     const incoming = Array.from(node.inputs.values()).map(
//       item => item as SatisGraphtoryLoopableNode
//     );
//
//     if (incoming.length > 1) {
//       circularTargets.add(node as SatisGraphtoryLoopableNode);
//     }
//
//     const incomingNotInSet = incoming.filter(node => !thisNodeSet.has(node));
//
//     if (incomingNotInSet.length > 0) {
//       // console.log('Contains external input!');
//       sources.add(node as SatisGraphtoryLoopableNode);
//       incomingNotInSet.forEach(item => {
//         Array.from(item.outputs.entries()).forEach(entry => {
//           const belt = entry[0] as Belt;
//           const node = entry[1] as SatisGraphtoryAbstractNode;
//
//           if (
//             node instanceof SatisGraphtoryLoopableNode &&
//             thisNodeSet.has(node)
//           ) {
//             incomingBelts.add(belt);
//           }
//         });
//         externalSources.add(item);
//       });
//     }
//
//     const outgoing = Array.from(node.outputs.values()).map(
//       item => item as SatisGraphtoryLoopableNode
//     );
//     const outgoingNotInSet = outgoing.filter(node => !thisNodeSet.has(node));
//
//     if (outgoingNotInSet.length > 0) {
//       targets.add(node as SatisGraphtoryLoopableNode);
//       outgoingNotInSet.forEach(item => externalTargets.add(item));
//     }
//   });
//
//   const sortedBelts = Array.from(incomingBelts).sort((a, b) => {
//     const beltA = Array.from(a.resources.values())
//       .flat(1)
//       .map(rate => rate.resource.itemQty);
//     const beltB = Array.from(b.resources.values())
//       .flat(1)
//       .map(rate => rate.resource.itemQty);
//     const maxA = Math.max(-Infinity, ...beltA);
//     const maxB = Math.max(-Infinity, ...beltB);
//
//     return maxB - maxA;
//   });
//   if (
//     sortedBelts.length === 0 ||
//     Array.from(sortedBelts[0].resources.values())
//       .flat(1)
//       .filter(item => item.resource.itemQty > 0).length === 0
//   ) {
//     throw new Error('No resources coming in!');
//   }
//
//   const usedBelt = sortedBelts[0];
//   const usedNode = usedBelt.target;
//
//   if (!(usedNode instanceof SatisGraphtoryLoopableNode)) {
//     throw new Error('Not a valid loopable node');
//   }
//
//   const queue: Array<SatisGraphtoryAbstractNode> = [];
//   const parentQueue: Array<SatisGraphtoryAbstractNode> = [];
//   const processed: Map<
//     SatisGraphtoryAbstractNode,
//     Nullable<SatisGraphtoryAbstractNode>
//   > = new Map();
//
//   if (sources.size === 0) {
//     throw new Error('Empty loop!');
//   }
//
//   queue.push(usedNode);
//
//   const initialBlacklistedBelts = new Set(
//     sortedBelts.filter(item => item !== usedBelt)
//   );
//
//   // const startingFraction = startingSource.getTotalResourceRate();
//
//   const processedEdges: Set<Belt> = new Set();
//   processedEdges.add(usedBelt);
//
//   while (queue.length) {
//     const popped = queue.shift();
//     const poppedParent = parentQueue.shift() || null;
//     if (popped === undefined) {
//       throw new Error("Somehow the queue length was defined but now it isn't");
//     }
//
//     if (!processed.has(popped)) {
//       processed.set(popped, poppedParent);
//       console.error('====================================');
//       console.error(
//         poppedParent ? poppedParent.constructor.name : 'null',
//         '=====>',
//         popped.constructor.name
//       );
//
//       // do some processing
//       popped.processInputs(initialBlacklistedBelts);
//       popped.distributeOutputs();
//       //then continue
//
//       Array.from(popped.outputs.entries())
//         .filter(entry => {
//           const item = entry[1];
//           const belt = entry[0];
//           return (
//             item instanceof SatisGraphtoryLoopableNode && belt instanceof Belt
//           );
//         })
//         .forEach(entry => {
//           const belt = entry[0] as Belt;
//           const node = entry[1] as SatisGraphtoryLoopableNode;
//
//           if (thisNodeSet.has(node)) {
//             if (!processed.has(node)) {
//               queue.push(node);
//               parentQueue.push(popped);
//             }
//           }
//         });
//     }
//   }
//
//   // at this point, let's go over nodes with MULTIPLE incoming. Then, we check to see if the edge has ADDITIONAL inputs.
//   // if it does, we'll need to aggregate them all
//
//   // Getting processed and non-processed belts based on seen parents.
//   Array.from(processed.entries()).forEach(entry => {
//     const child = entry[0];
//     const parent = entry[1];
//     if (parent === null) return;
//
//     Array.from(parent.outputs.entries())
//       .filter(entry => {
//         const childNode = entry[1];
//         return childNode === child;
//       })
//       .forEach(entry => {
//         const belt = entry[0];
//         if (!(belt instanceof Belt)) {
//           throw new Error('Not a belt!');
//         }
//         processedEdges.add(belt);
//       });
//   });
//
//   sources.forEach(source => {
//     const incoming = Array.from(source.inputs.keys())
//       .map(item => {
//         return item as Belt;
//       })
//       .filter(belt => !processedEdges.has(belt));
//     // console.assert(incoming.length > 0, "Has additional inputs");
//     console.error(incoming);
//   });
//
//   // ProcessedEdges has a list of all the edges that have been processed.
//
//   //2. Do a bfs using ALL sources, while propagating the resources via edges. Keep track of already visited note
//   // instances with the EDGES!!!! (and keep track of what each "PARENT" edge is to each item.
//   //3. Look at external output, calculate ratios with respect to each other.
//   //4. For each intersecting EDGE, look at it's carry. Look at existing input to see what the ratio is
//   // say, incoming is 0.5. If none exists, the ratio is 1.
//   //5. Then, for each output, look at the ratio (0.5/0.75) and then multiply it by the incoming (0.5 from above)
//   // and finally by the amount the new edge would have brought in (say, 0.25)
//   // keep an external ratio!
//   // If we have MULTI COMMODITY AND one of the propagators become overloaded, kill myself.
//   // Also ensure that belt speeds are the same for every output!!!!!!!
// };
//
// export default processLoop;
