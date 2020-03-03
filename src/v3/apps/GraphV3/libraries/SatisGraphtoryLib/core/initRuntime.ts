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
    // const allItems = new Set(data.item.map((item: any) => item.name));
    data.recipe.forEach((recipe: any) => {
      const sources = (recipe.producedIn ?? []).filter((producedIn: string) => {
        return !blackListedProducerTypes.has(producedIn);
      });

      // TODO: Sort sources by fastest avaliable speed;
      // sources.sort()

      if (sources.length === 0) {
        return;
      }

      (recipe.product ?? []).forEach((product: any) => {
        console.log(product);
        if (!recipesByProduct.has(product.resource)) {
          recipesByProduct.set(product.resource, []);
        }
        recipesByProduct.get(product.resource)!.push(recipe);
      });
    });

    console.log(recipesByProduct);
  });
};

export default initRuntime;
