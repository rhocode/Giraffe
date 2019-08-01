// const simplifyPool = (poolToChange, outputPool, replacement) => {
//   Object.keys(poolToChange).forEach(pool => {
//     const transformation = poolToChange[pool].map(item => {
//       if (outputPool.includes(item)) {
//         return replacement;
//       }
//       return item;
//     });
//     poolToChange[pool] = Array.from(new Set(transformation));
//   });
// };
//
// export default calculatePool = () => {
//   // https://github.com/tehalexf/satoolsfactory/blob/newcalc/src/components/GraphSvg/graphActions.jsx
// };
//
// const poolCalculation = (
//   blobOrder,
//   blobToNodes,
//   blobIncoming,
//   blobOutgoing
// ) => {
//   let newPoolIndex = 0;
//   const poolLookupOutputs = {};
//   const poolLookupInputs = {};
//   const poolLookup = {};
//
//   blobOrder.forEach(blob => {
//     let inputPool = null;
//     let outputPool = poolLookup[blob] || [];
//     if (outputPool.length > 1) {
//       const realOutputPool = Math.min(...outputPool);
//       outputPool.forEach(pool_number => {
//         if (pool_number !== realOutputPool) {
//           simplifyPool(poolLookup, outputPool, realOutputPool);
//           simplifyPool(poolLookupInputs, outputPool, realOutputPool);
//           simplifyPool(poolLookupOutputs, outputPool, realOutputPool);
//         }
//       });
//       outputPool = poolLookup[blob]; // refresh outputool
//     } else if (outputPool.length === 0) {
//       outputPool = [newPoolIndex++];
//     }
//
//     const nodes = blobToNodes[blob];
//     inputPool = outputPool[0];
//
//     if (nodes.length === 1) {
//       const node = nodes[0];
//       if (isMiner(node)) {
//         poolLookupOutputs[blob] = poolLookupOutputs[blob] || [];
//         poolLookupOutputs[blob].push(outputPool[0]);
//       } else if ((blobIncoming[blob] || []).length === 0) {
//         poolLookupOutputs[blob] = poolLookupOutputs[blob] || [];
//         poolLookupOutputs[blob].push(outputPool[0]);
//       } else if ((blobOutgoing[blob] || []).length === 0) {
//         poolLookupInputs[blob] = poolLookupInputs[blob] || [];
//         poolLookupInputs[blob].push(outputPool[0]);
//       } else if (isSplitter(node)) {
//       } else if (isMerger(node)) {
//       } else if (isContainer(node)) {
//       } else {
//         // it's a machine node
//         inputPool = newPoolIndex++;
//         poolLookupInputs[blob] = poolLookupInputs[blob] || [];
//         poolLookupInputs[blob].push(inputPool);
//         poolLookupOutputs[blob] = poolLookupOutputs[blob] || [];
//         poolLookupOutputs[blob].push(outputPool[0]);
//       }
//     }
//
//     (blobIncoming[blob] || []).forEach(incomingBlob => {
//       poolLookup[incomingBlob] = poolLookup[incomingBlob] || [];
//       poolLookup[incomingBlob].push(inputPool);
//     });
//   });
//
//   const outputs = Object.keys(poolLookupOutputs)
//     .map(i => poolLookupOutputs[i])
//     .flat(1);
//   const inputs = Object.keys(poolLookupInputs)
//     .map(i => poolLookupInputs[i])
//     .flat(1);
//   const commonalities = Array.from(
//     new Set(
//       outputs.filter(output => {
//         return inputs.includes(output);
//       })
//     )
//   );
//
//   const sources = {};
//
//   Object.keys(poolLookupOutputs).forEach(input => {
//     Array.from(new Set(poolLookupOutputs[input] || [])).forEach(item => {
//       if (commonalities.includes(item)) {
//         sources[input] = item;
//       }
//     });
//   });
//
//   const sinks = {};
//
//   Object.keys(poolLookupInputs).forEach(input => {
//     Array.from(new Set(poolLookupInputs[input] || [])).forEach(item => {
//       if (commonalities.includes(item)) {
//         sinks[input] = item;
//       }
//     });
//   });
//
//   return {
//     sources: sources,
//     sinks: sinks,
//     pools: commonalities,
//     poolOutputs: poolLookupOutputs,
//     poolInputs: poolLookupInputs,
//     poolLookup
//   };
// };

const derp = 10;

export default derp;
