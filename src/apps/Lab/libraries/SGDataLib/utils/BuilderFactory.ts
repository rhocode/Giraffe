export default function BuilderFactory<T, S>(
  interfaceObject: T,
  type: { new(): S }
): S {
  const starterObject: any = new type();

  Object.keys(interfaceObject).forEach((item: any) => {
    const itemInterfaceAny: any = interfaceObject as any;
    starterObject[item] = itemInterfaceAny[item];
  });

  return starterObject;
}

export function traverseDocPath(path: string, firebaseObject: any) {
  const pathArray: string[] = path.split('/');

  let i: number = 0;
  let ref: any = firebaseObject;

  pathArray.forEach((item: string) => {
    if (i % 2 === 0) {
      ref = ref.collection(item);
    } else {
      ref = ref.doc(item);
    }

    i++;
  });
  return ref;
}

export function BuilderFactoryFirebase<S>(
  firebaseObject: any,
  type: { new(): S }
): S {
  const starterObject: any = new type();

  const firebaseObjectAny = (firebaseObject as any).data();

  Object.keys(firebaseObjectAny).forEach((item: any) => {
    starterObject[item] = firebaseObjectAny[item];
  });

  starterObject.__sglib__firebaseId = (firebaseObject as any).id;
  starterObject.__sglib__firebaseRef = traverseDocPath(
    (firebaseObject as any).ref.path as string,
    (firebaseObject as any).ref.firestore
  );
  starterObject.__sglib__firebaseRefPath = (firebaseObject as any).ref.path;

  return starterObject;
}
