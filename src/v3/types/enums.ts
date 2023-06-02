export enum EResourceForm {
  RF_LIQUID,
  RF_SOLID,
  RF_GAS,
}

export enum EResourcePurity {
  RF_IMPURE,
  RF_NORMAL,
  RF_PURE,
}

export const EResourcePurityDisplayName = {
  [EResourcePurity.RF_IMPURE]: 'Impure',
  [EResourcePurity.RF_NORMAL]: 'Normal',
  [EResourcePurity.RF_PURE]: 'Pure',
};
