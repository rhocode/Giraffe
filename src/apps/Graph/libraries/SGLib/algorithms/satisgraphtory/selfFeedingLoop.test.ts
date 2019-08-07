import GroupNode from '../../datatypes/graph/groupNode';
import ResourcePacket from '../../datatypes/primitives/resourcePacket';
import Recipe from '../../datatypes/primitives/recipe';
import StrictProducerNode from '../../datatypes/satisgraphtory/strictProducerNode';
import BalancedPropagatorNode from '../../datatypes/satisgraphtory/balancedPropagatorNode';
import RecipeProcessorNode from '../../datatypes/satisgraphtory/recipeProcessorNode';
import processLoop from './selfFeedingLoop';

const createLoop = () => {
  const coal = new ResourcePacket(0, 1);
  const diamond = new ResourcePacket(1, 1);
  const coalRecipe = new Recipe([], [coal], 1);

  const coalProcessingRecipe = new Recipe([coal], [diamond], 1);

  const start = new StrictProducerNode(null, coalRecipe);
  const merger = new BalancedPropagatorNode(null);
  const firstTwoWaySplit = new BalancedPropagatorNode(null);
  const secondTwoWaySplit = new BalancedPropagatorNode(null);
  const terminalOne = new RecipeProcessorNode(null, coalProcessingRecipe);
  const terminalTwo = new RecipeProcessorNode(null, coalProcessingRecipe);

  start.addOutput(merger).setSpeed(60);
  merger.addOutput(firstTwoWaySplit).setSpeed(60);
  firstTwoWaySplit.addOutput(secondTwoWaySplit).setSpeed(60);
  firstTwoWaySplit.addOutput(terminalOne).setSpeed(60);
  secondTwoWaySplit.addOutput(merger).setSpeed(60);
  secondTwoWaySplit.addOutput(terminalTwo).setSpeed(60);

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
