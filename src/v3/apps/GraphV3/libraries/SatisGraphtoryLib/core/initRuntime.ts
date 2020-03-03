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

  const nodeTypes = satisGraphtoryApplicationNodeTypes.map((node: any) => {
    return Object.getPrototypeOf(node)
      .toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];
  });

  memoizedProtoSpecLoader(getLatestSchemaName()).then((data: any) => {
    console.log(data);

    const recipeNameMap: Map<string, any> = new Map();

    const allIngredients: Set<string> = new Set();
    const allProducts: Set<string> = new Set(
      data.extractorMachine
        .map((item: any) => {
          return item.allowedResources;
        })
        .flat(1)
    );

    // const allItems = new Set(data.item.map((item: any) => item.name));

    const adjacencyGraph: Map<string, string[]> = new Map();
    const recipeAdjacencyGraph: Map<string, string[]> = new Map();
    const recipeTopologicalSortList: Map<string, string[]> = new Map();

    data.recipe.forEach((recipe: any) => {
      const sources = (recipe.producedIn ?? []).filter((producedIn: string) => {
        return !blackListedProducerTypes.has(producedIn);
      });

      // TODO: Sort sources by fastest avaliable speed;
      // sources.sort() and get the fastest speed

      if (sources.length === 0) {
        return;
      }

      recipeNameMap.set(recipe.name, recipe);

      // Ingredients
      (recipe.ingredients ?? []).forEach((ingredient: any) => {
        allIngredients.add(ingredient.resource);

        if (!recipeAdjacencyGraph.has(ingredient.resource)) {
          recipeAdjacencyGraph.set(ingredient.resource, []);
        }

        recipeAdjacencyGraph.get(ingredient.resource)!.push(recipe.name);
      });

      recipeTopologicalSortList.set(
        recipe.name,
        (recipe.ingredients ?? []).map((item: any) => item.resource)
      );

      (recipe.product ?? []).forEach((product: any) => {
        allProducts.add(product.resource);

        if (!recipesByProduct.has(product.resource)) {
          recipesByProduct.set(product.resource, []);
        }
        recipesByProduct.get(product.resource)!.push(recipe);
      });
    });

    const extractors = data.extractorMachine;
    extractors.forEach((extractor: any) => {});

    const sources = new Set(
      [...allIngredients].filter(x => !allProducts.has(x))
    );

    console.error(sources);

    const processedResources = new Set([...sources]);

    // console.log(recipeAdjacencyGraph);
    sources.forEach((source: string) => {
      const recipesToProcess = recipeAdjacencyGraph.get(source)!;
      recipesToProcess.forEach((recipe: string) => {
        const remainingDeps = recipeTopologicalSortList
          .get(recipe)!
          .filter((item: string) => {
            return !processedResources.has(item);
          });
        console.log(remainingDeps, recipe);
      });
    });
  });
};

export default initRuntime;
