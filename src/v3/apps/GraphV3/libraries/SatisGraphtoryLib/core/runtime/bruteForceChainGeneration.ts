import * as math from 'mathjs';

const blackListedProducerTypes = new Set([
  'WorkBenchComponent',
  'BuildGun',
  'Converter'
]);

function calculateDuplicates(matrix: any) {
  const sortedMatrix: any = {};
  matrix.forEach((element: any) => {
    const allNames: string[] = [];
    element.cost.forEach((value: any, key: string) => {
      allNames.push(key);
    });
    const joinedName = allNames.sort().join('');
    if (sortedMatrix[joinedName] !== undefined) {
      const fetchedMatrices = sortedMatrix[joinedName];

      const recipeToCheck = element.cost;

      const replacedMatrices = new Set(
        fetchedMatrices.filter((possibleCostMatrix: any) => {
          const isLess: any[] = [];
          possibleCostMatrix.cost.forEach((value: any, key: string) => {
            isLess.push(math.smallerEq(recipeToCheck.get(key), value));
          });

          return isLess.every((bool: boolean) => bool);
        })
      );
      if (replacedMatrices.size) {
        sortedMatrix[joinedName] = [
          ...fetchedMatrices.filter((item: any) => !replacedMatrices.has(item)),
          element
        ];
      } else {
        sortedMatrix[joinedName] = [...fetchedMatrices, element];
      }
    } else {
      sortedMatrix[joinedName] = [element];
    }
  });

  return Object.values(sortedMatrix).flat(1);
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

  const target = 'SpaceElevatorPart_5';

  const cache: any = {};
  const recipeCache: any = {};

  const resolvePath = (
    target: string,
    rate: any,
    visitedSet: any = new Set()
  ): any => {
    console.log('VALLED WITH', target, rate, visitedSet);
    if (cache[target]) {
      return cache[target];
    }
    if (coreResources.has(target)) {
      const recipe = target;
      const retVal = [
        {
          name: recipe,
          recipes: [recipe],
          paths: [[]],
          cost: new Map([[target, rate]])
        }
      ];
      cache[target] = retVal;
      return retVal;
    } else {
      const possibleRecipes = [...(productsToRecipe.get(target) ?? [])].map(
        item => item.name
      );

      const choices = possibleRecipes
        .filter((item: any) => !visitedSet.has(item))
        .map((recipe: any) => {
          if (recipeCache[recipe] === undefined) {
            const amendedVisitedSet = new Set([
              ...visitedSet,
              ...possibleRecipes
            ]);

            const fetchedRecipe = nameToRecipe.get(recipe);
            const recipeIngredients = fetchedRecipe.ingredients;
            const duration = fetchedRecipe.manufacturingDuration;

            const actual = nameToRecipe
              .get(recipe)
              .product.filter((prod: any) => prod.resource === target);

            const ingredientSet = new Set(
              nameToRecipe
                .get(recipe)
                .ingredients.map((prod: any) => prod.resource)
            );
            const productSet = new Set(
              nameToRecipe.get(recipe).product.map((prod: any) => prod.resource)
            );

            if (actual.length !== 1) {
              throw new Error(
                'Something wrong with recipe, it has multiple actual resources'
              );
            }

            const requiredQuantity = actual[0]!.amount;

            let requestedRate = rate;
            if (typeof rate === 'number') {
              requestedRate = math.fraction(rate, 1);
            }

            const adjustedRecipeOutputQuantity = math.divide(
              requiredQuantity,
              duration
            );

            let multiplier = math.divide(
              requestedRate,
              adjustedRecipeOutputQuantity
            );

            const initialResult = new Map();

            let anyIsNull = false;
            recipeIngredients.forEach((ing: any) => {
              const recipeRate = math.fraction(ing.amount, duration);
              const pathResolver = resolvePath(
                ing.resource,
                math.multiply(multiplier, recipeRate),
                amendedVisitedSet
              );
              if (pathResolver === null) {
                anyIsNull = true;
              }
              initialResult.set(ing.resource, pathResolver);
            });

            if (anyIsNull) {
              return null;
            }

            let matrix: any = [];

            // For each resource there is N ways to make it.
            initialResult.forEach(
              (resourceCosts: any, resourceName: string) => {
                if (matrix.length === 0) {
                  resourceCosts.forEach((constituent: any) => {
                    matrix.push({
                      name: recipe,
                      recipes: [constituent.name],
                      paths: [constituent.recipes],
                      cost: constituent.cost
                    });
                  });
                } else {
                  let newMatrix: any = [];
                  resourceCosts.forEach((constituent: any) => {
                    matrix.forEach((matrixElement: any) => {
                      const newRecipes = [
                        ...matrixElement.recipes,
                        constituent.name
                      ];
                      const newPaths = [
                        ...matrixElement.paths,
                        constituent.recipes
                      ];
                      const totalNewCost = new Map();
                      matrixElement.cost.forEach((value: any, key: string) => {
                        totalNewCost.set(key, value);
                      });

                      constituent.cost.forEach((value: any, key: string) => {
                        const fetchedConstCost = totalNewCost.get(key);
                        if (fetchedConstCost === undefined) {
                          totalNewCost.set(key, value);
                        } else {
                          const newCost = math.add(fetchedConstCost, value);
                          totalNewCost.set(key, newCost);
                        }
                      });

                      newMatrix.push({
                        name: matrixElement.name,
                        recipes: newRecipes,
                        paths: newPaths,
                        cost: totalNewCost
                      });
                    });
                  });

                  matrix = newMatrix;
                }
              }
            );

            recipeCache[recipe] = calculateDuplicates(matrix);
          }
          return recipeCache[recipe];
        })
        .flat(1)
        .filter((item: any) => item !== null);

      if (choices.length === 0) {
        return null;
      }

      let intermediate = calculateDuplicates(choices);
      if (intermediate.length > 10) {
        intermediate = [intermediate[0]];
      }
      const retVal = intermediate;
      cache[target] = retVal;
      return retVal;
    }
  };

  const choiceMap = resolvePath(target, 1);
  console.log(choiceMap);
  console.log(
    choiceMap.map((item: any) => {
      const ret = [];
      for (let entry of item.cost) {
        ret.push([entry[0], entry[1].n / entry[1].d]);
      }
      return ret;
    })
  );
}
