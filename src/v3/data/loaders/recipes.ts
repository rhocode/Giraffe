import lazyFunc from 'v3/utils/lazyFunc';
import ConnectionsJson from 'data/Connections.json';
import BuildingJson from 'data/Buildings.json';
import ItemJson from 'data/Items.json';
import imageRepo from 'data/images/__all';
import RecipeJson from 'data/Recipes.json';
import {
  getBuildingByType,
  getBuildingDefinition
} from 'v3/data/loaders/buildings';
import {
  getItemByType,
  getItemDefinition,
  getResourcesByForm
} from 'v3/data/loaders/items';

// @ts-ignore
import {
  EResourcePurity,
  EResourcePurityDisplayName
} from '.data-landing/interfaces/enums/EResourcePurity';
import { getEnumDisplayNames, getEnumNames } from 'v3/data/loaders/enums';

const existingRecipeNames = new Set(Object.keys(RecipeJson));

// TODO: find a way to make this automatic?
const resolveDurationMultiplierForPurityNames = (name: string) => {
  switch (name) {
    case 'Impure':
    case 'Inpure':
      return 2;
    case 'Normal':
      return 1;
    case 'Pure':
      return 0.5;
    default:
      throw new Error('Unknown purity name ' + name);
  }
};

export const getExtractorRecipes = () => {
  const extractors = getBuildingByType('EXTRACTOR');

  const extractorsByResourceForm = new Map<number, any[]>();

  extractors.forEach(extractorSlug => {
    const extractorDefinition = getBuildingDefinition(extractorSlug);

    if (!extractorDefinition.onlyAllowCertainResources) {
      extractorDefinition.allowedResourceForms.forEach((rf: number) => {
        if (!extractorsByResourceForm.get(rf)) {
          extractorsByResourceForm.set(rf, []);
        }

        extractorsByResourceForm.get(rf)!.push(extractorSlug);
      });
    }
  });

  const extractorRecipes = [] as any[];

  const resourcePurityNames = getEnumDisplayNames(
    EResourcePurity,
    EResourcePurityDisplayName
  )
    .filter((item: string) => {
      return !item.endsWith('MAX');
    })
    .map((item: string) => {
      return item.replace(/^RP_/, '');
    });

  console.log(resourcePurityNames);

  for (const [
    allowedResourceForm,
    whitelistedMachines
  ] of extractorsByResourceForm.entries()) {
    const resourcesWithAllowedResourceForm = getResourcesByForm(
      allowedResourceForm
    );
    for (const resource of resourcesWithAllowedResourceForm) {
      const resourceData = getItemDefinition(resource);
      for (const purity of resourcePurityNames) {
        let proposedRecipeName = resource
          .replace(/^item-/g, `recipe-${purity}-`)
          .toLowerCase();
        extractorRecipes.push({
          slug: proposedRecipeName,
          recipe: {
            name: `${purity} ${resourceData.name}`,
            translation: {
              namespace: 'SGCUSTOM$$' + resourceData.translation.namespace,
              key: `${purity}-${resourceData.translation.key}`
            },
            ingredients: [],
            products: [
              {
                slug: resource,
                amount: 1
              }
            ],
            produceIn: [...whitelistedMachines],
            manualMultiplier: 1,
            manufacturingDuration: resolveDurationMultiplierForPurityNames(
              purity
            )
          }
        });
      }
    }

    // generate a recipe
  }
  // const values = keys.map(k => EResourcePurity[k as any]);
  console.log(extractorRecipes);
};
