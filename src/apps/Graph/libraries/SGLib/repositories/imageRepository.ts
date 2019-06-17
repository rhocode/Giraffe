function importAll(r: any) {
  let images: any = {};
  const promises = r.keys().map((item: any) => {
    const thisImage = new Image();
    thisImage.src = r(item);
    images[item.replace('./', '').toLowerCase()] = thisImage;
    return new Promise((resolve: any) => {
      thisImage.onload = () => {
        resolve(thisImage);
      }
    })
  });
  return {images, promises};
}

// eslint-disable-next-line
const machinePromises = importAll(
  (require as any).context('../images/machines', false, /\.(png|jpe?g|svg)$/)
);

const itemPromises = importAll(
  (require as any).context('../images/items', false, /\.(png|jpe?g|svg)$/)
);

export const imageRepositoryPromise = {
  machines: machinePromises.promises,
  items: itemPromises.promises
};

export const imageRepository = {
  machines: machinePromises.images,
  items: itemPromises.promises
};

// console.error(imageRepository);
