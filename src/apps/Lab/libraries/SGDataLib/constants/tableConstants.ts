import Item from '../datatypes/Item';
import Recipe from '../datatypes/Recipe';
import MachineClass from '../datatypes/MachineClass';
import UpgradeTier from '../datatypes/UpgradeTier';

export const tableMapping = {
  Item: Item,
  Recipe: Recipe,
  MachineClass: MachineClass,
  UpgradeTier: UpgradeTier
};

const fabrics = ['test', 'prod'];

export const getTables = (versions: any) => {
  return (versions || [])
    .map((version: any) =>
      Object.keys(tableMapping).map(name => {
        return [fabrics[0], version, name].join('/');
      })
    )
    .flat();
};
