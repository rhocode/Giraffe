function importAll(r: any) {
  let images: any = {};
  r.keys().forEach((item: any, index: number) => {
    const thisImage = new Image();
    thisImage.src = r(item);
    images[item.replace('./', '').toLowerCase()] = thisImage;
  });
  return images;
}

// eslint-disable-next-line

export const imageRepository = {
  machines: importAll(
    (require as any).context('../images/machines', false, /\.(png|jpe?g|svg)$/)
  ),
  items: importAll(
    (require as any).context('../images/items', false, /\.(png|jpe?g|svg)$/)
  )
};

// console.error(imageRepository);
