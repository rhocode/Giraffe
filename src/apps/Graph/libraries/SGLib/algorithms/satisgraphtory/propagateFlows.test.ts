import topologicalSort from '../graphProcessor';
import generatePools from '../calculatePool';
import SimpleCluster from '../../datatypes/graph/simpleCluster';
import RecipeProcessorNode from '../../datatypes/satisgraphtory/recipeProcessorNode';
import ResourcePacket from '../../datatypes/primitives/resourcePacket';
import Recipe from '../../datatypes/primitives/recipe';
import StrictProducerNode from '../../datatypes/satisgraphtory/strictProducerNode';
import propagateFlows from './propagateFlows';
import SplitterNode from '../../datatypes/satisgraphtory/splitterNode';
import MergerNode from '../../datatypes/satisgraphtory/mergerNode';

const generateSimpleCluster = () => {
  const coal = new ResourcePacket(0, 1);
  const diamond = new ResourcePacket(1, 1);
  const coalRecipe = new Recipe([], [coal], 1);

  const coalProcessingRecipe = new Recipe([coal], [diamond], 1);

  const start = new StrictProducerNode(null, coalRecipe);
  const split = new SplitterNode(null);
  const join = new MergerNode(null);
  const terminal = new RecipeProcessorNode(null, coalProcessingRecipe);

  start.addOutput(split).setSpeed(60);
  split.addOutput(join).setSpeed(30);
  split.addOutput(join).setSpeed(30);
  join.addOutput(terminal).setSpeed(60);

  return new SimpleCluster([start, split, join, terminal]);
};

it('Runs a simple propagation test on generator to sink node', () => {
  const cluster = generateSimpleCluster();
  const nonCyclic = cluster.generateNonCyclicCluster();
  const { normal } = topologicalSort(nonCyclic);

  const poolData = generatePools(nonCyclic, normal);

  propagateFlows(poolData);
});
