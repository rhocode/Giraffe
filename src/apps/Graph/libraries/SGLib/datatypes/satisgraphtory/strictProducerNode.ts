import RecipeProcessorNode from './recipeProcessorNode';

// Used for normal recipe processors
export default class StrictProducerNode extends RecipeProcessorNode {
  isClusterBoundary: boolean = true;

  distributeOutputs(): void {}

  processInputs(): void {}
}
