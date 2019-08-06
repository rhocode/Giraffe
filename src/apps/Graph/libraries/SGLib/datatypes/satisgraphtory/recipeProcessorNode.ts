import SatisGraphtoryAbstractNode from './satisGraphtoryAbstractNode';
import Recipe from '../primitives/recipe';

type Nullable<T> = T | null;

// Used for normal recipe processors
export default class RecipeProcessorNode extends SatisGraphtoryAbstractNode {
  isClusterBoundary: boolean = true;
  recipe: Nullable<Recipe>;

  constructor(data: Nullable<Object>, recipe: Nullable<Recipe>) {
    super(data, false);
    this.recipe = recipe;
  }

  distributeOutputs(): void {}

  processInputs(): void {}
}
