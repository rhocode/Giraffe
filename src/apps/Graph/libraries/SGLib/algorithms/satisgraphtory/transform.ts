import MachineNode, { GraphNode } from '../../datatypes/graph/graphNode';
import { GraphEdge } from '../../datatypes/graph/graphEdge';
// import SatisGraphtoryAbstractNode from "../../datatypes/satisgraphtory/satisGraphtoryAbstractNode";
import { recipeListPromise } from '../../../../../../graphql/resolvers';
import ResourcePacket from '../../datatypes/primitives/resourcePacket';
import Recipe from '../../datatypes/primitives/recipe';

type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const recipeRepository = () => {
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

        return finalMapping;
      });
    }

    return cachedResult;
  };
};

recipeRepository();

const transformGraph = (graphData: GraphData) => {
  const nodes = graphData.nodes || [];

  // const transformedNodes: SatisGraphtoryAbstractNode[] = [];
  nodes.forEach(node => {
    if (node instanceof MachineNode) {
      // Todo: maybe make different versions?
      if (node.machineObject) {
        switch (node.machineObject.class.name) {
          case 'container':
          default:
            break;
        }
        // const type = node.machineObject.class
        console.log(node.machineObject.class.name);
      }
    }
  });
};

export default transformGraph;
