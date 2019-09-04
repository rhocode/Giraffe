export const defaultMachineObjectMock = {
  recipe: 'iron_ingot_alloy',
  class: {
    name: 'foundry',
    icon: '/static/media/Foundry.23ceb7cd.png',
    hasUpgrades: true,
    id: 5,
    inputs: 2,
    outputs: 1,
    recipes: [
      {
        id: 'alternate_electromagnetic_control_rod',
        name: 'enriched_steel_ingot',
        input: [
          { item: { name: 'iron_ore' }, itemQuantity: 6 },
          {
            item: { name: 'compacted_coal' },
            itemQuantity: 3
          }
        ],
        output: [{ item: { name: 'steel_ingot' }, itemQuantity: 6 }]
      },
      {
        id: 'iron_ingot_alloy',
        name: 'alternate:_steel_ingot',
        input: [
          { item: { name: 'iron_ingot' }, itemQuantity: 3 },
          {
            item: { name: 'coal' },
            itemQuantity: 6
          }
        ],
        output: [{ item: { name: 'steel_ingot' }, itemQuantity: 6 }]
      },
      {
        id: 'alternate_plastic',
        name: 'iron_ingot_alloy',
        input: [
          { item: { name: 'iron_ore' }, itemQuantity: 1 },
          {
            item: { name: 'copper_ore' },
            itemQuantity: 1
          }
        ],
        output: [{ item: { name: 'iron_ingot' }, itemQuantity: 3 }]
      },
      {
        id: 'supercomputer',
        name: 'aluminum_ingot',
        input: [
          { item: { name: 'bauxite' }, itemQuantity: 7 },
          {
            item: { name: 'silica' },
            itemQuantity: 6
          }
        ],
        output: [{ item: { name: 'aluminum_ingot' }, itemQuantity: 2 }]
      },
      {
        id: 'uranium_cell',
        name: 'steel_ingot',
        input: [
          { item: { name: 'iron_ore' }, itemQuantity: 3 },
          { item: { name: 'coal' }, itemQuantity: 3 }
        ],
        output: [{ item: { name: 'steel_ingot' }, itemQuantity: 2 }]
      }
    ],
    instances: [
      { tier: { name: 'MK1', value: 0 } },
      { tier: { name: 'MK2', value: 1 } }
    ]
  },
  tier: 'MK2'
};
