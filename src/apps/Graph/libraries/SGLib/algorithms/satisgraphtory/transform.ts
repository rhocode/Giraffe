import MachineNode, { GraphNode } from '../../datatypes/graph/graphNode';
import { GraphEdge } from '../../datatypes/graph/graphEdge';
// import SatisGraphtoryAbstractNode from "../../datatypes/satisgraphtory/satisGraphtoryAbstractNode";
import { recipeListPromise } from '../../../../../../graphql/resolvers';
import ResourcePacket from '../../datatypes/primitives/resourcePacket';
import Recipe from '../../datatypes/primitives/recipe';
import SatisGraphtoryAbstractNode from '../../datatypes/satisgraphtory/satisGraphtoryAbstractNode';
import RecipeProcessorNode from '../../datatypes/satisgraphtory/recipeProcessorNode';
import StrictProducerNode from '../../datatypes/satisgraphtory/strictProducerNode';

type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const recipeRepositoryRaw = () => {
  let cachedResult: any = null;
  return () => {
    if (!cachedResult) {
      cachedResult = recipeListPromise().then((data: any) => {
        let finalMapping: Map<string, Recipe> = new Map();
        Object.keys(data).forEach(key => {
          const item = data[key];
          const identifier = item.id as string;
          const inputResourcePackets = (item.input || []).map(
            (element: any) =>
              new ResourcePacket(element.item, element.itemQuantity)
          );
          const outputResourcePackets = (item.output || []).map(
            (element: any) =>
              new ResourcePacket(element.item, element.itemQuantity)
          );
          finalMapping.set(
            identifier,
            new Recipe(inputResourcePackets, outputResourcePackets, item.time)
          );
        });

        finalMapping.set('', new Recipe([], [], 1));

        return finalMapping;
      });
    }

    return cachedResult;
  };
};

const recipeRepository = recipeRepositoryRaw();

const transformGraph = (graphData: GraphData) => {
  const nodes = graphData.nodes || [];

  recipeRepository().then((recipeData: any) => {
    const transformedNodes: SatisGraphtoryAbstractNode[] = [];
    nodes.forEach(node => {
      if (node instanceof MachineNode) {
        // Todo: maybe make different versions?
        if (node.machineObject) {
          const recipe = recipeData.get(node.machineObject.recipe);
          switch (node.machineObject.class.name) {
            case 'miner':
              transformedNodes.push(new StrictProducerNode(node, recipe));
              break;
            case 'smelter':
            case 'constructor':
            case 'assembler':
              transformedNodes.push(new RecipeProcessorNode(node, recipe));
              break;
            case 'container':
            default:
              console.error(
                'Unhandled machine type',
                node.machineObject.class.name
              );
              break;
            // transformedNodes.push(new RecipeProcessorNode(node, ))
            // return;
          }
          // const type = node.machineObject.class
          console.log(
            node.machineObject.class.name,
            recipeData.get(node.machineObject.recipe)
          );
        }
      }
    });
  });
};

export default transformGraph;
