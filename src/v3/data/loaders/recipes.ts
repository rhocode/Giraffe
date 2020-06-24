import RecipeJson from 'data/Recipes.json';
import {
  getBuildingByType,
  getBuildingDefinition,
} from 'v3/data/loaders/buildings';
import { getItemDefinition, getResourcesByForm } from 'v3/data/loaders/items';

import {
  EResourcePurity,
  EResourcePurityDisplayName,
} from '.data-landing/interfaces/enums/EResourcePurity';
import { getEnumDisplayNames } from 'v3/data/loaders/enums';
import memoize from 'fast-memoize';
import produce from 'immer';

// TODO: find a way to make this automatic?
const resolveDurationMultiplierForPurityNames = (name: string) => {
  switch (name) {
    case 'Impure':
    case 'Inpure': // :(
      return 2;
    case 'Normal':
      return 1;
    case 'Pure':
      return 0.5;
    default:
      throw new Error('Unknown purity name ' + name);
  }
};

export const getExtractorRecipesFn = () => {
  const extractors = getBuildingByType('EXTRACTOR');

  const extractorsByResourceForm = new Map<number, any[]>();

  const extractorRecipes = [] as any[];

  const extractorResultByMachine = new Map<string, Set<any>>();

  extractors.forEach((extractorSlug) => {
    const extractorDefinition = getBuildingDefinition(extractorSlug);

    if (!extractorDefinition.onlyAllowCertainResources) {
      extractorDefinition.allowedResourceForms.forEach((rf: number) => {
        if (!extractorsByResourceForm.get(rf)) {
          extractorsByResourceForm.set(rf, []);
        }

        extractorsByResourceForm.get(rf)!.push(extractorSlug);
      });
    } else {
      // First process the known extractors
      extractorDefinition.allowedResources.forEach(
        (allowedResource: string) => {
          if (!extractorResultByMachine.get(allowedResource)) {
            extractorResultByMachine.set(allowedResource, new Set());
          }

          extractorResultByMachine
            .get(allowedResource)!
            .add(extractorDefinition);
        }
      );
    }
  });

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

  const nonPurityNodes = new Set(['item-water']);

  for (const [resource, extractors] of extractorResultByMachine.entries()) {
    // This might change. One resource might have multiple extraction methods.
    for (const extractor of extractors) {
      const purityNames = nonPurityNodes.has(resource)
        ? ['']
        : resourcePurityNames;
      for (const purity of purityNames) {
        let proposedRecipeName = nonPurityNodes.has(resource)
          ? resource.replace(/^item-/g, `recipe-`).toLowerCase()
          : resource.replace(/^item-/g, `recipe-${purity}-`).toLowerCase();

        const resourceData = getItemDefinition(resource);
        extractorRecipes.push({
          slug: proposedRecipeName,
          recipe: {
            name: purity ? `${purity} ${resourceData.name}` : resourceData.name,
            translation: {
              namespace: purity
                ? 'SGCUSTOM$$' + resourceData.translation.namespace
                : resourceData.translation.namespace,
              key: purity
                ? `${purity}-${resourceData.translation.key}`
                : resourceData.translation.key,
            },
            ingredients: [],
            products: [
              {
                slug: resource,
                amount: extractor.itemsPerCycle,
              },
            ],
            producedIn: [extractor],
            manualMultiplier: 1,
            manufacturingDuration:
              extractor.extractCycleTime *
              (purity ? resolveDurationMultiplierForPurityNames(purity) : 1),
          },
        });

        console.log(extractorRecipes[extractorRecipes.length - 1]);
      }
    }
  }

  for (const [
    allowedResourceForm,
    whitelistedMachines,
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
              key: `${purity}-${resourceData.translation.key}`,
            },
            ingredients: [],
            products: [
              {
                slug: resource,
                amount: 1,
              },
            ],
            producedIn: [...whitelistedMachines],
            manualMultiplier: 1,
            manufacturingDuration:
              resourceData.extractCycleTime *
              resolveDurationMultiplierForPurityNames(purity),
          },
        });
      }
    }
  }

  return extractorRecipes;
};

export const getExtractorRecipes = memoize(getExtractorRecipesFn);

const getAllRecipesFn = () => {
  return produce(RecipeJson, (draftState) => {
    getExtractorRecipes().forEach(({ slug, recipe }) => {
      (draftState as any)[slug] = recipe;
    });
  });
};

const getRecipeListFn = () => {
  return Object.entries(getAllRecipes()).map(([slug, value]) => {
    return {
      ...value,
      slug,
    };
  });
};

const getMachineCraftableRecipeListFn = () => {
  return getRecipeList().filter(({ producedIn }) => {
    const handcraftingProducers = new Set([
      'building-build-gun',
      'building-work-bench-component',
      'building-converter', // this one is here because its recipes are not complete.
    ]);
    return (
      producedIn.filter((item: string) => {
        return !handcraftingProducers.has(item);
      }).length > 0
    );
  });
};

export const getMachineCraftableRecipeList = memoize(
  getMachineCraftableRecipeListFn
);
export const getAllRecipes = memoize(getAllRecipesFn);
export const getRecipeList = memoize(getRecipeListFn);
