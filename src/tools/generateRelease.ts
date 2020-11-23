import BuildingJson from 'data/Buildings.json';
import ItemJson from 'data/Items.json';
import { getAllRecipes } from 'v3/data/loaders/recipes';
import {
  buildingEnums,
  itemEnums,
  recipeEnums,
} from 'data/protobuf/protobufEnums';

const formatEntry = (
  key: string,
  number: number,
  deprecated: boolean = false,
  isNew: boolean = false
) => {
  return (
    `\t'${key}' = ${number},` +
    (deprecated ? '// deprecated' : '') +
    (isNew ? ' // new value' : '')
  );
};

const generateEnums = (
  newEnumNames: any,
  oldEnumsMap: any,
  desiredName: string
) => {
  const newNamesSet = new Set(newEnumNames);

  const lineEntries: string[] = [];

  let maxValue = 0;

  for (const [name, value] of oldEnumsMap) {
    if (newNamesSet.has(name)) {
      newNamesSet.delete(name);
      maxValue = Math.max(maxValue, value);
      lineEntries.push(formatEntry(name, value, false));
    } else {
      lineEntries.push(formatEntry(name, value, true));
    }
  }

  maxValue++;

  for (const name of newNamesSet) {
    lineEntries.push(formatEntry(name as string, maxValue, false, true));
  }

  return `export enum ${desiredName} {\n${lineEntries.join('\n')}\n}`;
};

export const generateBuildingEnums = () => {
  const oldEnumMap = Object.entries(buildingEnums).filter(
    ([, value]) => !isNaN(value as number)
  );
  const newEnumNames = Object.keys(BuildingJson);

  return generateEnums(newEnumNames, oldEnumMap, 'buildingEnums');
};

export const generateRecipeEnums = () => {
  const oldEnumMap = Object.entries(recipeEnums).filter(
    ([, value]) => !isNaN(value as number)
  );
  const newEnumNames = Object.keys(getAllRecipes());

  return generateEnums(newEnumNames, oldEnumMap, 'recipeEnums');
};

export const generateItemEnums = () => {
  const oldEnumMap = Object.entries(itemEnums).filter(
    ([, value]) => !isNaN(value as number)
  );
  const newEnumNames = Object.keys(ItemJson);

  return generateEnums(newEnumNames, oldEnumMap, 'itemEnums');
};
