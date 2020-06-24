import memoize from 'fast-memoize';
import { getMachineCraftableRecipeList } from 'v3/data/loaders/recipes';
import { getResources } from 'v3/data/loaders/items';

class Node {
  public visited = false;
  constructor(public resource: string) {}
}

class Edge {
  constructor(public recipe: string, public target: Node) {}
}

const getRecipeGraphFn = () => {
  const outgoingEdges = new Map<Node, Edge[]>();
  const incomingEdges = new Map<Node, Edge[]>();
  const nodeMap = new Map<string, Node>();

  getMachineCraftableRecipeList().forEach((recipe) => {
    const { ingredients, products, slug: recipeSlug } = recipe;
    [...ingredients, ...products].forEach(({ slug }) => {
      if (!nodeMap.has(slug)) {
        nodeMap.set(slug, new Node(slug));
      }
    });
    ingredients.forEach(({ slug: ingredientSlug }) => {
      products.forEach(({ slug: productSlug }) => {
        const ingredientNode = nodeMap.get(ingredientSlug)!;
        const productNode = nodeMap.get(productSlug)!;
        if (!outgoingEdges.has(ingredientNode)) {
          outgoingEdges.set(ingredientNode, []);
        }
        if (!incomingEdges.has(productNode)) {
          incomingEdges.set(productNode, []);
        }
        outgoingEdges
          .get(ingredientNode)!
          .push(new Edge(recipeSlug, productNode));
        incomingEdges
          .get(productNode)!
          .push(new Edge(recipeSlug, ingredientNode));
      });
    });
  });

  const allNodes = new Set(nodeMap.values());
  // const nodeEnds = new Set(outgoingEdges.keys());
  const nodeStarts = new Set(incomingEdges.keys());
  const sourceNodes = new Set([...allNodes].filter((x) => !nodeStarts.has(x)));

  // TODO: fixup sourceNodes to return the set of nodes with have no incoming edges OR
  // only have incoming edges FROM THEMSELVES?
  for (const resourceName of getResources()) {
    const node = nodeMap.get(resourceName);
    if (!node) {
      throw new Error('No node exists with resourceName ' + resourceName);
    }
    sourceNodes.add(node);
  }

  // const sinkNodes = new Set([...allNodes].filter((x) => !nodeEnds.has(x)));

  const processingStack = [] as Node[];

  // procedure DFS_iterative(G, v) is
  //   let S be a stack
  //   S.push(v)
  processingStack.push(...sourceNodes);
  //   while S is not empty do
  while (processingStack.length) {
    //     v = S.pop()
    const vertex = processingStack.pop()!;
    //   if v is not labeled as discovered then

    if (!vertex.visited) {
      //   label v as discovered
      vertex.visited = true;

      //   for all edges from v to w in G.adjacentEdges(v) do
      for (const outgoingEdge of outgoingEdges.get(vertex) || []) {
        processingStack.push(outgoingEdge.target);
      }
    }
  }

  return {
    nodeMap,
    incomingEdges,
    outgoingEdges,
  };
};

export const getPossibleRecipesFromSinkItem = (sinkItem: string) => {
  const { nodeMap, incomingEdges } = getRecipeGraph();
  const sinkNode = nodeMap.get(sinkItem);

  if (!sinkNode) {
    throw new Error('Unknown sinkNode ' + sinkItem);
  }

  const processingStack = [] as Node[];
  const visitedSet = new Set<string>();
  const possibleRecipes = new Set<string>();

  // procedure DFS_iterative(G, v) is
  //   let S be a stack
  //   S.push(v)
  processingStack.push(sinkNode);
  //   while S is not empty do
  while (processingStack.length) {
    //     v = S.pop()
    const vertex = processingStack.pop()!;
    //   if v is not labeled as discovered then

    if (!visitedSet.has(vertex.resource)) {
      //   label v as discovered
      visitedSet.add(vertex.resource);

      //   for all edges from v to w in G.adjacentEdges(v) do
      for (const incomingEdge of incomingEdges.get(vertex) || []) {
        processingStack.push(incomingEdge.target);
        possibleRecipes.add(incomingEdge.recipe);
      }
    }
  }

  return possibleRecipes;
};

export const getRecipeGraph = memoize(getRecipeGraphFn);
