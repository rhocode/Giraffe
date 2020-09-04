const TIERS = ['I', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export const getTierText = (tier: number) => {
  // TODO: Localize
  if (tier <= 0) {
    return '';
  } else {
    return TIERS[tier];
  }
};
