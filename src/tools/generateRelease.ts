import BuildingJson from 'data/Buildings.json';
import ItemJson from 'data/Items.json';
import { getAllRecipes } from 'v3/data/loaders/recipes';

export const generateBuildingEnums = () => {
  const entries: string[] = [];
  let enumNumber = 1;
  Object.keys(BuildingJson).forEach((key) => {
    entries.push(`\t"${key}" = ${enumNumber++}`);
  });

  return `export enum buildingEnums {\n${entries.join(',\n')}\n}`;
};

export const generateRecipeEnums = () => {
  const entries: string[] = [];
  let enumNumber = 1;
  Object.keys(getAllRecipes()).forEach((key) => {
    entries.push(`\t"${key}" = ${enumNumber++}`);
  });

  return `export enum recipeEnums {\n${entries.join(',\n')}\n}`;
};

export const generateItemEnums = () => {
  const entries: string[] = [];
  let enumNumber = 1;
  Object.keys(ItemJson).forEach((key) => {
    entries.push(`\t"${key}" = ${enumNumber++}`);
  });

  return `export enum itemEnums {\n${entries.join(',\n')}\n}`;
};
