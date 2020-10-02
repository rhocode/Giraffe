import entries, { manifest } from 'data/images/__all';

const cdn =
  'https://raw.githubusercontent.com/rhocode/Giraffe/master/src/data/images/';

export function getAllImageFiles() {
  return manifest.map((item) => cdn + item);
}

export function importImageManifest() {
  const promises = [];

  for (const file of manifest) {
    console.log();
    if (process.env.NODE_ENV === 'production') {
      SGImageRepo.set(file, cdn + file);
      promises.push(fetch(cdn + file, { cache: 'force-cache' }));
    } else {
      const entryUrl = ((entries as unknown) as any)[
        'sg' + file.replace('.256.png', '_256').replace(/-/g, '_')
      ];
      SGImageRepo.set(file, entryUrl);
      promises.push(fetch(entryUrl, { cache: 'force-cache' }));
      // console.log(entries)
    }

    // promises.push(
    //   Promise.resolve(() => {
    //     return
    //   })
    // );
  }

  return Promise.all(promises);
}

const SGImageRepo = new Map<string, any>();

export default SGImageRepo;
