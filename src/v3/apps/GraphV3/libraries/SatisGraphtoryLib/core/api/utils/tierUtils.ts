export const getTier = (tier: number) => {
  // TODO: Localize
  if (tier === 0) {
    return 'Mk1';
  } else {
    return 'Mk' + tier;
  }
};
