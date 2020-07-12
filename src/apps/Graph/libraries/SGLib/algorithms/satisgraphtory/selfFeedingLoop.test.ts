// @ts-ignore
it('processes the loop (new)', () => {
  console.log('Dummy func');
});
// import GroupNode from '../../datatypes/graph/groupNode';
// import ResourcePacket from '../../datatypes/primitives/resourcePacket';
// import Recipe from '../../datatypes/primitives/recipe';
// import StrictProducerNode from '../../datatypes/satisgraphtory/strictProducerNode';
// import RecipeProcessorNode from '../../datatypes/satisgraphtory/recipeProcessorNode';
// import { processLoop } from './selfFeedingLoop';
// import MergerNode from '../../datatypes/satisgraphtory/mergerNode';
// import SplitterNode from '../../datatypes/satisgraphtory/splitterNode';
// import SimpleNode from '../../datatypes/graph/simpleNode';
//
// const createLoop = () => {
//   const coal = new ResourcePacket(0, 1);
//   const diamond = new ResourcePacket(1, 1);
//   const coalRecipe = new Recipe([], [coal], 1);
//
//   const coalProcessingRecipe = new Recipe([coal], [diamond], 1);
//
//   const start = new StrictProducerNode(null, coalRecipe);
//   const merger = new MergerNode(null);
//   const firstTwoWaySplit = new SplitterNode(null);
//   const secondTwoWaySplit = new SplitterNode(null);
//   const terminalOne = new RecipeProcessorNode(null, coalProcessingRecipe);
//   const terminalTwo = new RecipeProcessorNode(null, coalProcessingRecipe);
//
//   start.addOutput(merger).setSpeed(60);
//   merger.addOutput(firstTwoWaySplit).setSpeed(60);
//   firstTwoWaySplit.addOutput(secondTwoWaySplit).setSpeed(60);
//   firstTwoWaySplit.addOutput(terminalOne).setSpeed(60);
//   secondTwoWaySplit.addOutput(merger).setSpeed(60);
//   secondTwoWaySplit.addOutput(terminalTwo).setSpeed(60);
//
//   // Set up the state of the graph such that the initial start node has propagated its output
//   start.distributeOutputs();
//
//   return new GroupNode([merger, firstTwoWaySplit, secondTwoWaySplit]);
// };
//
// const createSimpleLoop = () => {
//   const A = new SimpleNode(null).setInternalDescriptor('A');
//   const B = new SimpleNode(null).setInternalDescriptor('B');
//   const C = new SimpleNode(null).setInternalDescriptor('C');
//   const D = new SimpleNode(null).setInternalDescriptor('D');
//   const E = new SimpleNode(null).setInternalDescriptor('E');
//
//   A.addOutput(B).setWeight(1);
//   B.addOutput(C).setWeight(0);
//   C.addOutput(D).setWeight(0);
//   D.addOutput(B).setWeight(0);
//   C.addOutput(E).setWeight(0);
//
//   return new GroupNode([B, C, D]);
// };
//
// it('creates the loop', () => {
//   const loop = createLoop();
//   expect(loop).toBeDefined();
// });
//

//
// //TODO: write a test where in the middle of some shit, everything propagates to a container with NO OUTPUT!!!!!!
//
// //todo: verify a-> b, a->c, b-> d, d->c, c->b, d-> e works!!!!
// //as in,
