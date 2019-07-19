import * as items from '../images/items/__all'
import * as machines from '../images/machines/__all';

function listedImport(items: any) {
  let images: any = {};
  const promises = Object.keys(items.default).map(item => {
    const thisImage = new Image();
    thisImage.src = (items.default as any)[item];
    images[item.toLowerCase()] = thisImage;
    return new Promise((resolve: any) => {
      thisImage.onload = () => {
        resolve(thisImage);
      }
    })
  });
  return {images, promises};
}

const machinePromises = listedImport(machines);

const itemPromises = listedImport(items);

export const imageRepositoryPromise = {
  machines: machinePromises.promises,
  items: itemPromises.promises
};

export const imageRepository = {
  machines: machinePromises.images,
  items: itemPromises.promises
};

