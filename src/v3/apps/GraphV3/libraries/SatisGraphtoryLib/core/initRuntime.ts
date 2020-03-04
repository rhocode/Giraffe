import memoizedProtoSpecLoader from 'v3/utils/protoUtils';
import { getLatestSchemaName } from 'apps/Graph/libraries/SGLib/utils/getLatestSchema';
import { satisGraphtoryApplicationNodeTypes } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/sourcetools/satisGraphtoryApplicationSharedTypes';

const blackListedProducerTypes = new Set([
  'WorkBenchComponent',
  'BuildGun',
  'Converter'
]);

const initRuntime = () => {
  // const ItemEnum = protobufRoot.lookupEnum('ItemEnum');
  // const Recipe = protobufRoot.lookupType('Recipe');

  // console.log(ItemEnum)

  const recipesByProduct: Map<String, Array<object>> = new Map();

  // const nodeTypes = satisGraphtoryApplicationNodeTypes.map((node: any) => {
  //   return Object.getPrototypeOf(node)
  //     .toString()
  //     .split('(' || /s+/)[0]
  //     .split(' ' || /s+/)[1];
  // });

  memoizedProtoSpecLoader(getLatestSchemaName()).then((data: any) => {
    console.log(data);

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

      // Products
      (recipe.product ?? []).forEach((product: any) => {
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

    recipeNameMap.forEach((recipe: any, key: any) => {
      // Products
      const whitelistedProduct = (recipe.product ?? []).filter(
        (ingredient: any) => {
          return !coreResources.has(ingredient.resource);
        }
      );

      let shouldSkip = false;

      if (whitelistedProduct.length === 0) {
        // The "other" products are not extras.
        shouldSkip = true;
      }

      (recipe.product ?? []).forEach((ingredient: any) => {
        if (!shouldSkip && coreResources.has(ingredient.resource)) {
          console.log('Skipping', ingredient.resource, key);
          return;
        }
      });
    });

    console.error(recipeIngredientList, recipeProductList);

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

    console.log('Initially making', processingQueue);

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

      if (remainingProducts.length === 0) {
        console.error(
          'This only makes core resources. We should ignore it?',
          populatedRecipe
        );
      } else {
        let usedProducts = populatedRecipeProducts;
        if (populatedRecipeProducts.length !== remainingProducts.length) {
          console.error(
            'Size mismatch. We have additional resources generated.'
          );
          usedProducts = remainingProducts;
        } else {
          console.log('This makes non core resources. yay', usedProducts);
        }

        usedProducts.forEach((product: any) => {
          const resource = product.resource;
          const fetched = recipeProductList.get(resource);
          console.log(popped, 'This recipe makes', resource);
          console.log('This list should remove the deps from', fetched);
          fetched.delete(popped);

          if (fetched.size === 0) {
            console.error('We can resolve', resource);

            if (resource === 'SulfuricAcid') {
              throw new Error('DMKNSMSDGG');
            }
            // resource: "OreUranium"
            // amount: 5
            // __proto__: Object
            // 1:
            // resource: "SulfuricAcid"

            processedResources.add(resource);
            (recipeIngredientList.get(resource) ?? []).forEach(
              (recipe: string) => {
                console.log('Resource', resource, 'feeds', recipe);
                const remainingDeps = recipeIngredientReverseLookupList
                  .get(recipe)!
                  .filter((item: string) => {
                    return !processedResources.has(item);
                  });

                console.log('   > ', recipe);
                recipeIngredientReverseLookupList.set(recipe, remainingDeps);

                if (remainingDeps.length === 0) {
                  processingQueue.push(recipe);
                  console.error('SIZE IS ZERO FOR', recipe);
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
        clashingRecipes.add(recipeNameMap.get(item));
      });
    });

    console.log(clashingRecipes);

    //
    //

    //
    //       fetched.delete(populatedRecipe.name);
    //
    //       console.log("Fetched is now", fetched);
    //
    //       if (fetched.size === 0) {
    //         console.log("!!!! FETCHED SIZE FOR", resource, "IS NOW ZERO");
    //         processedResources.add(resource);
    //
    //         const recipesToProcess = recipeIngredientList.get(resource) ?? [];
    //         recipesToProcess.forEach((recipe: string) => {
    //           const remainingDeps = recipeIngredientReverseLookupList
    //             .get(recipe)!
    //             .filter((item: string) => {
    //               return !processedResources.has(item);
    //             });
    //
    //           console.log("Remaining deps", remainingDeps, recipeIngredientReverseLookupList
    //             .get(recipe)!);
    //
    //           recipeIngredientReverseLookupList.set(recipe, remainingDeps);
    //           if (remainingDeps.length === 0) {
    //             console.log("   None left", recipe);
    //             processingQueue.push(recipe)
    //           }
    //         });
    //       }
    //     })
    //   }
    // }

    // coreResources.forEach((source: string) => {
    //   const recipesToProcess = recipeIngredientList.get(source)!;
    //   recipesToProcess.forEach((recipe: string) => {
    //     const remainingDeps = recipeIngredientReverseLookupList
    //       .get(recipe)!
    //       .filter((item: string) => {
    //         return !processedResources.has(item);
    //       });
    //
    //     recipeIngredientReverseLookupList.set(recipe, remainingDeps);
    //     if (remainingDeps.length === 0) {
    //       console.log(recipe);
    //       processingQueue.push(recipe)
    //     }
    //   });
    // });

    // const recipeOrdering = [];
    // const finalQueueList = new Set();
    // const queuedRecipe = new Set();
    //
    // const numRecipesLeft: Map<string, number> = new Map();

    // coreResources.forEach((source: string) => {
    //   numRecipesLeft.set(source, 0);
    // });

    // recipeIngredientList.forEach((value: any, key: string) => {
    //   // console.log(key, recipeIngredientReverseLookupList);
    //   const remainingDeps = (
    //     recipeIngredientReverseLookupList.get(key) ?? []
    //   ).filter((item: string) => {
    //     return !coreResources.has(item);
    //   });
    //
    //   recipeIngredientReverseLookupList.set(key, remainingDeps);
    //   numRecipesLeft.set(key, remainingDeps.length);
    // });
    //
    // while (processingQueue.length) {
    //   const popped = processingQueue.shift()!;
    //
    //   if (finalQueueList.has(popped)) {
    //     continue;
    //   } else {
    //     finalQueueList.add(popped);
    //     recipeOrdering.push(popped);
    //   }
    //
    //   const fetchedRecipe = recipeNameMap.get(popped);
    //   if (fetchedRecipe === undefined) {
    //     console.log('!!!');
    //   } else {
    //     console.log('???');
    //   }
    //
    //   recipeNameMap.get(popped)!.product.forEach((prod: any) => {});
    // }

    // while(processingQueue.length) {
    //   const popped = processingQueue.shift()!;
    //
    //   if (finalQueueList.has(popped)) {
    //     continue;
    //   } else {
    //     finalQueueList.add(popped);
    //     recipeOrdering.push(popped);
    //   }
    //
    //   recipeNameMap.get(popped)!.product.forEach((prod: any) => {
    //     const recipesToProcess = recipeIngredientList.get(prod.resource) ?? [];
    //
    //     console.log("We need to process", recipesToProcess, prod.resource);
    //     // processedResources.add(prod.resource);
    //
    //
    //     recipesToProcess.forEach((recipe: string) => {
    //       const remainingDeps = recipeIngredientReverseLookupList
    //         .get(recipe)!
    //         .filter((item: string) => {
    //           return !processedResources.has(item);
    //         });
    //       console.log("Remaining deps", remainingDeps)
    //     //
    //     //   recipeTopologicalSortList.set(recipe, remainingDeps);
    //     //   //
    //     //   if (remainingDeps.length === 0 && !queuedRecipe.has(recipe)) {
    //     //     queuedRecipe.add(recipe);
    //     //     processingQueue.push(recipe)
    //     //   }
    //     });
    //   });
    // }

    return;
    // const allItems = new Set(data.item.map((item: any) => item.name));
    //
    // data.recipe.forEach((recipe: any) => {
    //
    //   const sources = (recipe.producedIn ?? []).filter((producedIn: string) => {
    //     return !blackListedProducerTypes.has(producedIn);
    //   });
    //
    //   // TODO: Sort sources by fastest avaliable speed;
    //   // sources.sort() and get the fastest speed
    //
    //   const allRecipeItems = new Set([ ...(recipe.product ?? []).map((ing: any) => {
    //     return ing.resource;
    //   })]);
    //
    //   // // Remove fluidCanister TODO: fix this somehow
    //   // if (allRecipeItems.has("FluidCanister")) {
    //   //   return;
    //   // }
    //
    //   if (allRecipeItems.has("FluidCanister") && allRecipeItems.size !== 1) {
    //     return;
    //   }
    //
    //   if (sources.length === 0) {
    //     return;
    //   }
    //
    //   recipeNameMap.set(recipe.name, recipe);
    //
    //   // Ingredients
    //   (recipe.ingredients ?? []).forEach((ingredient: any) => {
    //     allIngredients.add(ingredient.resource);
    //
    //     if (!recipeAdjacencyGraph.has(ingredient.resource)) {
    //       recipeAdjacencyGraph.set(ingredient.resource, []);
    //     }
    //
    //     recipeAdjacencyGraph.get(ingredient.resource)!.push(recipe.name);
    //   });
    //
    //   recipeTopologicalSortList.set(
    //     recipe.name,
    //     (recipe.ingredients ?? []).map((item: any) => item.resource)
    //   );
    //
    //   (recipe.product ?? []).forEach((product: any) => {
    //     allProducts.add(product.resource);
    //
    //     if (!recipesByProduct.has(product.resource)) {
    //       recipesByProduct.set(product.resource, []);
    //     }
    //     recipesByProduct.get(product.resource)!.push(recipe);
    //   });
    // });
    //
    // const sources = new Set([
    //   ...[...allIngredients].filter(x => !allProducts.has(x)),
    //   ...extractorProducedResources
    // ]);
    //
    //
    // console.log(sources);
    //
    // //
    // const processedResources = new Set([...sources]);
    // //
    // const processingQueue: string[] = [];
    // //
    // sources.forEach((source: string) => {
    //   const recipesToProcess = recipeAdjacencyGraph.get(source)!;
    //   recipesToProcess.forEach((recipe: string) => {
    //     const remainingDeps = recipeTopologicalSortList
    //       .get(recipe)!
    //       .filter((item: string) => {
    //         return !processedResources.has(item);
    //       });
    //
    //     recipeTopologicalSortList.set(recipe, remainingDeps);
    //     if (remainingDeps.length === 0) {
    //       processingQueue.push(recipe)
    //     }
    //   });
    // });
    //
    // //
    // const recipeOrdering = [];
    // const finalQueueList = new Set();
    // const queuedRecipe = new Set();
    //
    // while(processingQueue.length) {
    //   const popped = processingQueue.shift()!;
    //
    //   if (finalQueueList.has(popped)) {
    //     continue;
    //   } else {
    //     finalQueueList.add(popped);
    //     recipeOrdering.push(popped);
    //   }
    //
    //   recipeNameMap.get(popped)!.product.forEach((prod: any) => {
    //     const recipesToProcess = recipeAdjacencyGraph.get(prod.resource) ?? [];
    //     processedResources.add(prod.resource);
    //     recipesToProcess.forEach((recipe: string) => {
    //       const remainingDeps = recipeTopologicalSortList
    //         .get(recipe)!
    //         .filter((item: string) => {
    //           return !processedResources.has(item);
    //         });
    //
    //       recipeTopologicalSortList.set(recipe, remainingDeps);
    //       //
    //       if (remainingDeps.length === 0 && !queuedRecipe.has(recipe)) {
    //         queuedRecipe.add(recipe);
    //         processingQueue.push(recipe)
    //       }
    //     });
    //   });
    // }
    // const orderingMap = new Map();
    // recipeOrdering.forEach((item: string, index: number) => {
    //   orderingMap.set(item, index);
    // });
    //
    // console.log(recipeOrdering);
    //
    // const optimalRecipe: any = new Map();
    // const optimalRecipeCost: any = new Map();
    // recipeOrdering.forEach((recipe: any) => {
    //   const ingredients = recipeNameMap.get(recipe)!.ingredients;
    //   ingredients.forEach((ing: any) => {
    //     const possibleSubRecipes = recipesByProduct.get(ing.resource) ?? [];
    //     console.log("Trying to get", ing.resource)
    //     if (possibleSubRecipes.length !== 0) {
    //       console.log("WE HAVE OUR FIRST SHIT", recipesByProduct.get(ing.resource));
    //       throw new Error("@@@@");
    //     } else {
    //       optimalRecipe.set(ing.resource, "");
    //       optimalRecipeCost.set(ing.resource, []);
    //       console.log("Ingredient", ing.resource, "should be a terminal resource, we made", recipe);
    //     }
    //   });
    // });
    //
    // // TODO: Fix the above to use the proper ordering
    // Object.keys(recipesByProduct).forEach((key: string) => {
    //   recipesByProduct.get(key)!.sort((rec1: any, rec2: any): number => {
    //     const alt1 = rec1.name.indexOf("Alternate") !== -1 ? 1 : 0;
    //     const alt2 = rec2.name.indexOf("Alternate") !== -1 ? 1 : 0;
    //     return alt1 - alt2;
    //   })
    // });
    //
    // // const needed = [{name: "IronRod", quantity: 3}];
    // //
    // // const createChain = (resource: any, path: any, total: any) => {
    // //
    // // };
    // //
    // // const chain: any = [];
    // // createChain(needed[0].name, chain, []);
    // //
    // // const possibleRecipes = recipesByProduct.get(needed[0].name);
    // //
    // // console.log(possibleRecipes);
  });
};

export default initRuntime;
