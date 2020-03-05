const blackListedProducerTypes = new Set([
  'WorkBenchComponent',
  'BuildGun',
  'Converter'
]);

export default function bruteForceChainGeneration(data: any) {
  const nameToRecipe: Map<string, any> = new Map();

  const allProducts: Set<string> = new Set();
  const allIngredients: Set<string> = new Set();
  const extractorProducedResources: Set<string> = new Set(
    data.extractorMachine
      .map((item: any) => {
        return item.allowedResources;
      })
      .flat(1)
  );

  const recipesUsed = data.recipe;
  // .filter((item: any) => {
  //   return item.name.indexOf('Alternate') === -1;
  // });

  const ingredientsToRecipe = new Map();
  const productsToRecipe = new Map();

  recipesUsed.forEach((recipe: any) => {
    const sources = (recipe.producedIn ?? []).filter((producedIn: string) => {
      return !blackListedProducerTypes.has(producedIn);
    });

    if (sources.length === 0) {
      return;
    }

    nameToRecipe.set(recipe.name, recipe);

    // Ingredients
    (recipe.ingredients ?? []).forEach((ingredient: any) => {
      const resource = ingredient.resource;
      allIngredients.add(resource);

      if (!ingredientsToRecipe.get(resource)) {
        ingredientsToRecipe.set(resource, new Set());
      }

      ingredientsToRecipe.get(resource)!.add(recipe);
    });

    // Products
    (recipe.product ?? []).forEach((product: any) => {
      const resource = product.resource;
      allProducts.add(product.resource);

      if (!productsToRecipe.get(resource)) {
        productsToRecipe.set(resource, new Set());
      }

      productsToRecipe.get(resource)!.add(recipe);
    });
  });

  const coreResources = new Set([
    ...[...allIngredients].filter(x => !allProducts.has(x)),
    ...extractorProducedResources
  ]);

  const target = 'GenericBiomass';

  // const recursivePath = (item: string, currentPath: any) => {
  //
  //   const traversal: string[] = [...(productsToRecipe.get(item) ?? [])].map(item => item.name);
  //
  //   const visitedRecipes = new Set();
  //   const parent = new Map();
  //
  //   while(traversal.length) {
  //     const current = traversal.shift()!;
  //     if (visitedRecipes.has(current)) {
  //        continue;
  //     }
  //
  //     console.log("Visiting", current);
  //     visitedRecipes.add(current);
  //
  //     const constituents = nameToRecipe.get(current)!.ingredients;
  //
  //     constituents.forEach((ingredient: any) => {
  //
  //       const resource = ingredient.resource;
  //       console.log("  Ingredient: ", resource)
  //       const possibleRecipes = [...(productsToRecipe.get(resource) ?? [])].map(item => item.name);
  //       console.log("  Recipes: ", productsToRecipe.get(resource));
  //
  //       possibleRecipes.forEach((subRecipe: string) => {
  //         if (!parent.has(subRecipe)) {
  //           parent.set(subRecipe, current);
  //           traversal.push(subRecipe);
  //         }
  //       })
  //     });
  //   }
  //   console.log(parent);
  // };

  const visitedRecipes = new Set();

  const recursivePath = (
    item: string,
    currentPath: any,
    visited: any,
    visited2: any
  ) => {
    if (coreResources.has(item)) {
      //TODO: fix item;
      return [{ cost: [{ qty: 1, item }], path: [] }];
    }

    const visitedItems = new Set([...visited2, item]);

    const possibleRecipes = [...(productsToRecipe.get(item) ?? [])].map(
      item => item.name
    );
    console.log('>>>', visitedItems);
    possibleRecipes.forEach((recipe: any) => {
      if (visited.has(recipe)) {
        return;
      }

      console.log('This is a recipe:', recipe);
      const newVisited = new Set([...visited, recipe]);
      const newPath = [...currentPath, recipe];
      const recipeIngredients = nameToRecipe
        .get(recipe)
        .ingredients.map((item: any) => item.resource);
      const choices = recipeIngredients
        .map((item: any) => {
          console.log('This is an ingredient:', item);
          if (visitedItems.has(item)) {
            return null;
          }
          return recursivePath(
            item,
            newPath,
            newVisited,
            new Set([...visitedItems, item])
          );
        })
        .flat(1);
      console.log(JSON.stringify(choices, null, 2), newPath);
    });
  };

  const path: any = [];
  recursivePath(target, path, visitedRecipes, new Set());
}
