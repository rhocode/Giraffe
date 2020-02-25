//TODO: Fix the image repo links
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

export const imageRepositoryPromise = {};

export const imageRepository = {};

export const urlRepository = {};
