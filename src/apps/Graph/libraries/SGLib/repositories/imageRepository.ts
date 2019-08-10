import * as items from '../images/items/__all';
import * as machines from '../images/machines/__all';
import * as altMachines from '../images/alt/machines/__all';

function listedImport(items: any) {
  let images: any = {};
  let urls: any = {};
  const promises = Object.keys(items.default).map(item => {
    const thisImage = new Image();
    thisImage.src = (items.default as any)[item];
    urls[item.toLowerCase()] = (items.default as any)[item];
    images[item.toLowerCase()] = thisImage;
    return new Promise((resolve: any) => {
      thisImage.onload = () => {
        resolve(thisImage);
      };
    });
  });
  return { images, promises, urls };
}

const machinePromises = listedImport(machines);

const itemPromises = listedImport(items);

const machineAltPromises = listedImport(altMachines);

export const imageRepositoryPromise = {
  machines: machinePromises.promises,
  items: itemPromises.promises,
  machinesAlt: machineAltPromises.promises
};

export const imageRepository = {
  machines: machinePromises.images,
  items: itemPromises.images,
  machinesAlt: machineAltPromises.images
};

export const urlRepository = {
  machines: machinePromises.urls,
  items: itemPromises.urls,
  machinesAlt: machineAltPromises.urls
};
