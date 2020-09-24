import {manifest} from 'data/images/__all';

const cdn = "https://raw.githubusercontent.com/rhocode/Giraffe/master/src/data/images/";

export function getAllImageFiles() {
  return manifest.map(item => cdn + item);
}

export function importImageManifest() {

  const promises = [];
  for (const file of manifest) {
    SGImageRepo.set(file, cdn + file);

    console.log(cdn + file);
    promises.push(
      Promise.resolve(() => {

      })
      // fetch(cdn + file)
      // .then(response => response.blob())
      // .then(images => {
      //   const reader = new FileReader() ;
      //   reader.onload = function(){
      //     SGImageRepo.set(file, this.result)
      //   };
      //   reader.readAsDataURL(images) ;
      //
      //
      //
      // })
    );
  }

  return Promise.all(promises);
}

const SGImageRepo = new Map<string, any>();


export default SGImageRepo;