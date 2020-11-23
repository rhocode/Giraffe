import entries, { manifest } from 'data/images/__all';

const cdn =
  'https://raw.githubusercontent.com/rhocode/Giraffe/master/src/data/images/';

export function getAllImageFiles() {
  return manifest.map((item: any) => cdn + item);
}

async function checkFile(
  file: string,
  cache: any,
  refreshCache: boolean = false
) {
  const req = new Request(cdn + file);
  const promises = [];
  if (!(await cache.match(req))) {
    console.log('Adding image to cache:', file);
    promises.push(cache.add(req));
  }

  return Promise.all(promises);
}

async function cacheImages() {
  const cache = await caches.open('satisgraphtory-image-cache');
  const promises: any = [];
  const refreshCache = window.location.search.indexOf('refreshImages=1') > -1;

  for (const file of manifest) {
    promises.push(checkFile(file, cache, refreshCache));
  }

  await Promise.all(promises);

  const secondPromise = [];
  for (const file of manifest) {
    secondPromise.push(
      cache
        .match(cdn + file)
        .then((resp) => {
          if (!resp) {
            throw new Error('Did not load properly');
          }

          return resp.blob();
        })
        .then((blob) => {
          let imageUrl = URL.createObjectURL(blob);
          SGImageRepo.set(file, imageUrl);
          return Promise.resolve();
        })
    );
  }
  return Promise.all(secondPromise);
}

export function importImageManifest() {
  const promises: any = [];

  if (process.env.NODE_ENV === 'production') {
    promises.push(cacheImages());
  } else {
    for (const file of manifest) {
      const entryUrl = ((entries as unknown) as any)[
        'sg' + file.replace('.256.png', '_256').replace(/-/g, '_')
      ];
      SGImageRepo.set(file, entryUrl);
      promises.push(fetch(entryUrl, { cache: 'force-cache' }));
    }
  }

  return Promise.all(promises);
}

const SGImageRepo = new Map<string, any>();

export default SGImageRepo;
