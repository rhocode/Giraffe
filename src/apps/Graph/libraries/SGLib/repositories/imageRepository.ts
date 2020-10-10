function listedImport(items: any) {
  let images: any = {};
  let urls: any = {};
  const promises = [] as any[];
  //   Object.keys(items.default).map(item => {
  //   const thisImage = new Image();
  //   thisImage.src = (items.default as any)[item];
  //   urls[item.toLowerCase()] = (items.default as any)[item];
  //   images[item.toLowerCase()] = thisImage;
  //   return new Promise((resolve: any) => {
  //     thisImage.onload = () => {
  //       resolve(thisImage);
  //     };
  //   });
  // });
  return { images, promises, urls };
}

const machinePromises = listedImport([]);

const itemPromises = listedImport([]);

const machineAltPromises = listedImport([]);

export const imageRepositoryPromise = {
  machines: machinePromises.promises,
  items: itemPromises.promises,
  machinesAlt: machineAltPromises.promises,
};

export const imageRepository = {
  machines: machinePromises.images,
  items: itemPromises.images,
  machinesAlt: machineAltPromises.images,
};

export const urlRepository = {
  machines: machinePromises.urls,
  items: itemPromises.urls,
  machinesAlt: machineAltPromises.urls,
};
