import * as math from 'mathjs';

const blackListedProducerTypes = new Set([
  'WorkBenchComponent',
  'BuildGun',
  'Converter'
]);

function eqSet(as: any, bs: any) {
  return as.size === bs.size && all(isIn(bs), as);
}

console.log(eqSet);

function all(pred: any, as: any) {
  for (let a of as) if (!pred(a)) return false;
  return true;
}

function isIn(as: any) {
  return function(a: any) {
    return as.has(a);
  };
}

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
            isLess.push(math.smaller(recipeToCheck.get(key), value));
          });

          console.log(isLess);

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

  const target = 'Wire';

  const resolvedRecipe: any = new Map();

  const cache: any = {};
  const recipeCache: any = {};

  const recursivePathGenerator = (target: string, rate: any) => {
    if (cache[target] === undefined) {
      const resolvePath = (
        target: string,
        rate: any,
        visitedSet: any = new Set()
      ): any[] => {
        if (coreResources.has(target)) {
          const recipe = target;
          return [
            {
              name: recipe,
              recipes: [recipe],
              paths: [[]],
              cost: new Map([[target, rate]])
            }
          ];
        } else {
          const possibleRecipes = [...(productsToRecipe.get(target) ?? [])].map(
            item => item.name
          );

          const choices = possibleRecipes
            .filter((item: any) => !visitedSet.has(item))
            .map((recipe: any) => {
              if (recipeCache[recipe] === undefined) {
                const amendedVisitedSet = new Set([...visitedSet, recipe]);

                const fetchedRecipe = nameToRecipe.get(recipe);
                const recipeIngredients = fetchedRecipe.ingredients;
                const duration = fetchedRecipe.manufacturingDuration;

                const actual = nameToRecipe
                  .get(recipe)
                  .product.filter((prod: any) => prod.resource === target);

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

                recipeIngredients.forEach((ing: any) => {
                  const recipeRate = math.fraction(ing.amount, duration);
                  initialResult.set(
                    ing.resource,
                    resolvePath(
                      ing.resource,
                      math.multiply(multiplier, recipeRate),
                      amendedVisitedSet
                    )
                  );
                });

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
                          matrixElement.cost.forEach(
                            (value: any, key: string) => {
                              totalNewCost.set(key, value);
                            }
                          );

                          constituent.cost.forEach(
                            (value: any, key: string) => {
                              const fetchedConstCost = totalNewCost.get(key);
                              if (fetchedConstCost === undefined) {
                                totalNewCost.set(key, value);
                              } else {
                                const newCost = math.add(
                                  fetchedConstCost,
                                  value
                                );
                                totalNewCost.set(key, newCost);
                              }
                            }
                          );

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
          return calculateDuplicates(choices);
        }
      };
      cache[target] = resolvePath(target, rate);
    }

    return cache[target];
  };

  const choiceMap = recursivePathGenerator(target, 1);
  console.log(
    choiceMap.map((item: any) => {
      const ret = [];
      for (let entry of item.cost) {
        ret.push([entry[0], entry[1].n / entry[1].d]);
      }
      return ret;
    })
  );

  const recursivePath = (
    item: string,
    ratePerSecond: any,
    visitedSet: any = new Set()
  ) => {
    if (cache[item] !== undefined) {
      if (item === 'OreIron') {
        throw new Error('Q#KNQK@#@Q');
      }
      return cache[item];
    } else {
      const resolveCacheValue = (
        item: string,
        ratePerSecond: any,
        visitedSet: any = new Set()
      ) => {
        if (coreResources.has(item)) {
          //TODO: fix item and do basic math to get the quantity
          const recipe = item;
          return [
            {
              name: recipe,
              recipes: [recipe],
              paths: [[]],
              cost: new Map([[item, ratePerSecond]])
            }
          ];
        }

        const possibleRecipes = [...(productsToRecipe.get(item) ?? [])].map(
          item => item.name
        );

        return possibleRecipes
          .map((recipe: any) => {
            if (visitedSet.has(recipe)) {
              return null;
            }
            const amendedVisitedSet = new Set([...visitedSet, recipe]);

            const fetchedRecipe = nameToRecipe.get(recipe);
            const recipeIngredients = fetchedRecipe.ingredients;
            const duration = fetchedRecipe.manufacturingDuration;

            const actual = nameToRecipe
              .get(recipe)
              .product.filter((prod: any) => prod.resource === item);

            if (actual.length !== 1) {
              throw new Error(
                'Something wrong with recipe, it has multiple actual resources'
              );
            }

            const requiredQuantity = actual[0]!.amount;

            let requestedRate = ratePerSecond;
            if (typeof ratePerSecond === 'number') {
              requestedRate = math.fraction(ratePerSecond, 1);
            }

            const adjustedRecipeOutputQuantity = math.divide(
              requiredQuantity,
              duration
            );

            let multiplier = math.divide(
              requestedRate,
              adjustedRecipeOutputQuantity
            );
            let result;

            if (resolvedRecipe.get(recipe) !== undefined) {
              result = resolvedRecipe.get(recipe);
            } else {
              const initialResult = new Map();

              recipeIngredients.forEach((ing: any) => {
                const recipeRate = math.fraction(ing.amount, duration);
                initialResult.set(
                  ing.resource,
                  recursivePath(
                    ing.resource,
                    math.multiply(multiplier, recipeRate),
                    amendedVisitedSet
                  )
                );
              });

              let matrix: any = [];

              console.log(recipe, nameToRecipe.get(recipe));
              console.log(initialResult);
              // For each resource there is N ways to make it.
              initialResult.forEach(
                (resourceCosts: any, resourceName: string) => {
                  if (matrix.length === 0) {
                    resourceCosts.forEach((constituent: any) => {
                      matrix.push({
                        name: recipe,
                        recipes: [constituent.name],
                        paths: constituent.paths,
                        cost: constituent.cost
                      });
                    });
                  } else {
                    let newMatrix: any = [];
                    resourceCosts.forEach((constituent: any) => {
                      matrix.forEach((matrixElement: any) => {
                        const newRecipes = [
                          ...constituent.recipes,
                          ...matrixElement.recipes
                        ];
                        const newPaths = [
                          ...constituent.paths,
                          ...matrixElement.paths
                        ];
                        const totalNewCost = new Map();
                        matrixElement.cost.forEach(
                          (value: any, key: string) => {
                            totalNewCost.set(key, value);
                          }
                        );

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

              result = matrix;

              resolvedRecipe.set(recipe, result);
            }

            return result;
          })
          .filter((item: any) => item !== null)
          .flat(1);
      };
      cache[item] = resolveCacheValue(item, ratePerSecond, visitedSet);
      console.log(cache[item]);
    }
  };
}
