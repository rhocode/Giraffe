import MachineNode, { GraphNode } from '../../datatypes/graph/graphNode';
import { GraphEdge } from '../../datatypes/graph/graphEdge';
// import SatisGraphtoryAbstractNode from "../../datatypes/satisgraphtory/satisGraphtoryAbstractNode";
import { recipeListPromise } from '../../../../../../graphql/resolvers';
import ResourcePacket from '../../datatypes/primitives/resourcePacket';
import Recipe from '../../datatypes/primitives/recipe';
import SatisGraphtoryAbstractNode from '../../datatypes/satisgraphtory/satisGraphtoryAbstractNode';
import RecipeProcessorNode from '../../datatypes/satisgraphtory/recipeProcessorNode';
import StrictProducerNode from '../../datatypes/satisgraphtory/strictProducerNode';
import SimpleCluster from '../../datatypes/graph/simpleCluster';
import topologicalSort from '../graphProcessor';
import generatePools from '../calculatePool';
import propagateFlows from './propagateFlows';

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
  recipeRepository().then((recipeData: any) => {
    const nodes = graphData.nodes || [];
    const edges = graphData.edges || [];

    if (nodes.length === 0) {
      return;
    }

    const nodeMapping: Map<GraphNode, SatisGraphtoryAbstractNode> = new Map();

    const transformedNodes: SatisGraphtoryAbstractNode[] = [];
    nodes.forEach(node => {
      if (node instanceof MachineNode) {
        // Todo: maybe make different versions?
        if (node.machineObject) {
          const recipe = recipeData.get(node.machineObject.recipe);
          switch (node.machineObject.class.name) {
            case 'miner':
              const minerNode = new StrictProducerNode(node, recipe);
              nodeMapping.set(node, minerNode);
              transformedNodes.push(minerNode);
              break;
            case 'smelter':
            case 'constructor':
            case 'assembler':
              const recipeNode = new RecipeProcessorNode(node, recipe);
              nodeMapping.set(node, recipeNode);
              transformedNodes.push(recipeNode);
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

    edges.forEach(edge => {
      const source = nodeMapping.get(edge.source);
      const target = nodeMapping.get(edge.target);
      if (source === undefined || target === undefined) {
        throw new Error(
          'Undefined source or target' +
            edge.source.id +
            edge.target.id +
            source +
            target
        );
      }

      const producedEdge = source.addOutput(target, undefined, edge);

      //TODO: replace with data
      switch (edge.speedEnum) {
        case 'mk1':
          producedEdge.setSpeed(60);
          break;
        case 'mk2':
          producedEdge.setSpeed(120);
          break;
        case 'mk3':
          producedEdge.setSpeed(270);
          break;
        case 'mk4':
          producedEdge.setSpeed(480);
          break;
        case 'mk5':
          producedEdge.setSpeed(780);
          break;
        default:
          break;
      }
      //TODO: change the edge speed
    });

    const cluster = new SimpleCluster(transformedNodes);
    const nonCyclic = cluster.generateNonCyclicCluster();
    const { normal } = topologicalSort(nonCyclic);

    const poolData = generatePools(nonCyclic, normal);
    propagateFlows(poolData);
  });
};

export default transformGraph;
