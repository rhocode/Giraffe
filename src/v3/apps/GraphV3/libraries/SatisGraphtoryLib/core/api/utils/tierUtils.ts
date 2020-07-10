export const getTier = (tier: number) => {
  // TODO: Localize
  if (tier <= 0) {
    return 'Mk 1';
  } else {
    return 'Mk ' + tier;
  }
};
