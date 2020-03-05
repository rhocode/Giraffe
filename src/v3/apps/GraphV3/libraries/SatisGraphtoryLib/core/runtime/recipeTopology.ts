const blackListedProducerTypes = new Set([
  'WorkBenchComponent',
  'BuildGun',
  'Converter'
]);

export default function generateOrdering(data: any) {
  const recipeNameMap: Map<string, any> = new Map();

  const allProducts: Set<string> = new Set();
  const allIngredients: Set<string> = new Set();
  const extractorProducedResources: Set<string> = new Set(
    data.extractorMachine
      .map((item: any) => {
        return item.allowedResources;
      })
      .flat(1)
  );

  const recipeIngredientList: Map<string, any> = new Map();
  const recipeProductList: Map<string, any> = new Map();
  const recipeIngredientReverseLookupList: Map<string, any> = new Map();

  const recipesUsed = data.recipe.filter((item: any) => {
    return item.name.indexOf('Alternate') === -1;
  });

  recipesUsed.forEach((recipe: any) => {
    const sources = (recipe.producedIn ?? []).filter((producedIn: string) => {
      return !blackListedProducerTypes.has(producedIn);
    });

    const allRecipeItems = new Set([
      ...(recipe.product ?? []).map((ing: any) => {
        return ing.resource;
      })
    ]);

    if (allRecipeItems.has('FluidCanister') && allRecipeItems.size !== 1) {
      return;
    }

    if (sources.length === 0) {
      return;
    }

    // Set the topological sort
    recipeIngredientReverseLookupList.set(
      recipe.name,
      (recipe.ingredients ?? []).map((item: any) => item.resource)
    );

    recipeNameMap.set(recipe.name, recipe);

    // Ingredients
    (recipe.ingredients ?? []).forEach((ingredient: any) => {
      allIngredients.add(ingredient.resource);

      if (!recipeIngredientList.has(ingredient.resource)) {
        recipeIngredientList.set(ingredient.resource, []);
      }

      recipeIngredientList.get(ingredient.resource)!.push(recipe.name);
    });

    const recipeIngredients = new Set(
      (recipe.ingredients ?? []).map((item: any) => {
        return item.resource;
      })
    );

    // Products
    (recipe.product ?? [])
      .filter((item: any) => {
        return !recipeIngredients.has(item.resource);
      })
      .forEach((product: any) => {
        allProducts.add(product.resource);

        if (!recipeProductList.has(product.resource)) {
          recipeProductList.set(product.resource, new Set());
        }

        recipeProductList.get(product.resource)!.add(recipe.name);
      });
  });

  const coreResources = new Set([
    ...[...allIngredients].filter(x => !allProducts.has(x)),
    ...extractorProducedResources
  ]);

  const processedResources = new Set([...coreResources]);

  const processingQueue: string[] = [];

  coreResources.forEach((source: string) => {
    const recipesToProcess = recipeIngredientList.get(source)!;
    recipesToProcess.forEach((recipe: string) => {
      const remainingDeps = recipeIngredientReverseLookupList
        .get(recipe)!
        .filter((item: string) => {
          return !processedResources.has(item);
        });

      recipeIngredientReverseLookupList.set(recipe, remainingDeps);
      if (remainingDeps.length === 0) {
        processingQueue.push(recipe);
      }
    });
  });

  const recipeOrdering = [];
  const finalQueueList = new Set();
  //
  while (processingQueue.length) {
    const popped = processingQueue.shift()!;

    if (finalQueueList.has(popped)) {
      continue;
    } else {
      finalQueueList.add(popped);
      recipeOrdering.push(popped);
    }

    const populatedRecipe = recipeNameMap.get(popped);

    const populatedRecipeProducts = populatedRecipe.product ?? [];

    const remainingProducts = populatedRecipeProducts.filter(
      (ingredient: any) => {
        return !coreResources.has(ingredient.resource);
      }
    );

    if (remainingProducts.length !== 0) {
      let usedProducts = populatedRecipeProducts;
      if (populatedRecipeProducts.length !== remainingProducts.length) {
        usedProducts = remainingProducts;
      }

      usedProducts.forEach((product: any) => {
        const resource = product.resource;
        const fetched = recipeProductList.get(resource);
        fetched.delete(popped);

        if (fetched.size === 0) {
          processedResources.add(resource);
          (recipeIngredientList.get(resource) ?? []).forEach(
            (recipe: string) => {
              const remainingDeps = recipeIngredientReverseLookupList
                .get(recipe)!
                .filter((item: string) => {
                  return !processedResources.has(item);
                });

              recipeIngredientReverseLookupList.set(recipe, remainingDeps);

              if (remainingDeps.length === 0) {
                processingQueue.push(recipe);
              }
            }
          );
        }
      });
    }
  }

  const clashingRecipes = new Set();

  recipeProductList.forEach((value: any, key: string) => {
    value.forEach((item: any) => {
      if (!coreResources.has(item)) {
        clashingRecipes.add(recipeNameMap.get(item));
      }
    });
  });

  console.log(recipeOrdering);
}
