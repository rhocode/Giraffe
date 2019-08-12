import GroupNode from '../../datatypes/graph/groupNode';
import ResourcePacket from '../../datatypes/primitives/resourcePacket';
import Recipe from '../../datatypes/primitives/recipe';
import StrictProducerNode from '../../datatypes/satisgraphtory/strictProducerNode';
import RecipeProcessorNode from '../../datatypes/satisgraphtory/recipeProcessorNode';
import processLoop from './selfFeedingLoop';
import MergerNode from '../../datatypes/satisgraphtory/mergerNode';
import SplitterNode from '../../datatypes/satisgraphtory/splitterNode';

const createLoop = () => {
  const coal = new ResourcePacket(0, 1);
  const diamond = new ResourcePacket(1, 1);
  const coalRecipe = new Recipe([], [coal], 1);

  const coalProcessingRecipe = new Recipe([coal], [diamond], 1);

  const start = new StrictProducerNode(null, coalRecipe);
  const merger = new MergerNode(null);
  const firstTwoWaySplit = new SplitterNode(null);
  const secondTwoWaySplit = new SplitterNode(null);
  const terminalOne = new RecipeProcessorNode(null, coalProcessingRecipe);
  const terminalTwo = new RecipeProcessorNode(null, coalProcessingRecipe);

  start.addOutput(merger).setSpeed(60);
  merger.addOutput(firstTwoWaySplit).setSpeed(60);
  firstTwoWaySplit.addOutput(secondTwoWaySplit).setSpeed(60);
  firstTwoWaySplit.addOutput(terminalOne).setSpeed(60);
  secondTwoWaySplit.addOutput(merger).setSpeed(60);
  secondTwoWaySplit.addOutput(terminalTwo).setSpeed(60);

  // Set up the state of the graph such that the initial start node has propagated its output
  start.distributeOutputs();

  return new GroupNode([merger, firstTwoWaySplit, secondTwoWaySplit]);
};

it('creates the loop', () => {
  const loop = createLoop();
  expect(loop).toBeDefined();
});

it('processes the loop', () => {
  const loop = createLoop();
  processLoop(loop);
});
