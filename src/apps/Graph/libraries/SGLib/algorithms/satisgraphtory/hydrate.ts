import MachineNode from '../../datatypes/graph/graphNode';
import { getPlaceableMachineClasses } from '../../../../graphql/queries';
import { GraphEdge } from '../../datatypes/graph/graphEdge';

const hydrate = (
  deserializedData: any,
  translate: any = (a: string) => a,
  transform: any,
  callback: any
) => {
  const nodes = deserializedData.nodes;
  const edges = deserializedData.edges;
  console.time('initial load of classes');
  getPlaceableMachineClasses().then((classes: any) => {
    console.timeEnd('initial load of classes');
    const mapping: any = {};
    Object.values(classes).forEach((value: any) => {
      mapping[value.name] = value;
    });

    const nodeMapping: any = {};

    const hydratedNodes = nodes.map((node: any) => {
      const selectedMachine = {
        recipe: node.recipe,
        class: mapping[node.machineClass],
        tier: node.tier
      };

      const newNode = new MachineNode(
        selectedMachine,
        node.overclock,
        node.fx,
        node.fy,
        false,
        translate,
        transform,
        node.id
      );
      nodeMapping[node.id] = newNode;
      return newNode;
    });

    const hydratedEdges = edges.map((edge: any) => {
      return new GraphEdge(
        nodeMapping[edge.sourceNodeId],
        nodeMapping[edge.targetNodeId],
        edge.tier,
        true,
        edge
      );
    });

    callback({
      nodes: hydratedNodes,
      edges: hydratedEdges
    });
  });
};

export default hydrate;
