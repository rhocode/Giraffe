import ResourcePacket from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/complex/resourcePacket';

export const dataFromImport = function(className: string, data: any) {
  const [itemClass, amount] = data;
  const parsedItemClass = itemClass.replace(
    /.*\.Desc_([a-zA-Z0-9-_]+)_C"'/g,
    '$1'
  );
  const parsedItemAmount = parseInt(amount.replace(/Amount=([0-9]+)/g, '$1'));

  console.log(parsedItemAmount, parsedItemClass);
  return 2;
  // return new ResourcePacket({
  //   name: parsedItemClass + ',' + parsedItemAmount,
  //   resource: parsedItemClass,
  //   amount: parsedItemAmount
  // })
};
