export const GREEN = 0x15cb07;
export const ORANGE = 0xffa328;
export const WHITE = 0xffffff;
export const GREY = 0x313234;
export const YELLOW = 0xd4ce22;
export const BLUE = 0x47a3ff;
export const PURPLE = 0x7122d5;
export const DARK_GREY = 0x222222;
export const CANVAS_BACKGROUND_COLOR = 0x1d1e20;
export const DARK_ORANGE = 0x9b5900;

const MACHINE_CLASS_MAP: Record<string, string> = {
  'building-assembler': 'machine',
  'building-constructor': 'machine',
  'building-foundry': 'machine',
  'building-manufacturer': 'machine',
  'building-oil-refinery': 'machine',
  'building-smelter': 'machine',
  'building-miner': 'machine',
  'building-oil-pump': 'machine',
  'building-water-pump': 'machine',
  'building-pipeline-pump': 'machine',
  'machine-group-logistics': 'infra',
  'machine-group-liquid-storage': 'storage',
  'machine-group-item-storage': 'storage',
};

export const getTypeFromMachineClass = (slug: string): string => {
  return MACHINE_CLASS_MAP[slug] || 'machine';
};
