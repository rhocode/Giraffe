import * as math from 'mathjs';

const blackListedProducerTypes = new Set([
  'WorkBenchComponent',
  'BuildGun',
  'Converter'
]);

function eqSet(as: any, bs: any) {
  return as.size === bs.size && all(isIn(bs), as);
}

function all(pred: any, as: any) {
  for (let a of as) if (!pred(a)) return false;
  return true;
}

function isIn(as: any) {
  return function(a: any) {
    return as.has(a);
  };
}

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

  const target = 'IronRod';

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

  const resolvedRecipe: any = new Map();

  const recursivePath = (
    item: string,
    quantity: number,
    visitedSet: any = new Set()
  ) => {
    if (coreResources.has(item)) {
      //TODO: fix item and do basic math to get the quantity
      return {
        recipe: 'BASIC',
        ingredientMap: null,
        currentCost: [[{ qty: 1, item }]]
      };
    }

    const possibleRecipes = [...(productsToRecipe.get(item) ?? [])].map(
      item => item.name
    );

    const choices = possibleRecipes
      .map((recipe: any) => {
        if (visitedSet.has(recipe)) {
          return null;
        }
        const amendedVisitedSet = new Set([...visitedSet, recipe]);
        const recipeIngredients = nameToRecipe
          .get(recipe)
          .ingredients.map((item: any) => item.resource);

        const actual = nameToRecipe
          .get(recipe)
          .product.filter((prod: any) => prod.resource === item);

        if (actual.length !== 1) {
          throw new Error(
            'Something wrong with recipe, it has multiple actual resources'
          );
        }

        const requiredQuantity = actual[0]!.amount;
        console.log(requiredQuantity);

        const multiplier = math.fraction(quantity, requiredQuantity);
        console.log(multiplier);

        let result;

        if (resolvedRecipe.get(recipe) !== undefined) {
          result = resolvedRecipe.get(recipe);
        } else {
          const initialResult = new Map();

          recipeIngredients.forEach((ing: any) => {
            initialResult.set(ing, recursivePath(ing, 2, amendedVisitedSet));
          });

          result = {
            recipe: recipe,
            currentCost: [[{ qty: 1, item }]],
            ingredientMap: initialResult
          };

          resolvedRecipe.set(recipe, result);
        }

        return resolvedRecipe.get(recipe)!;
      })
      .filter((item: any) => item !== null);

    return choices[0];
  };

  const choiceMap = recursivePath(target, 1);
  console.log(choiceMap);
}
