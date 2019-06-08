export default class SerializationHelper {
  static toInstance<T>(obj: T, json: string): T {
    const jsonObj = JSON.parse(json);

    const anyObj = obj as any;

    if (typeof anyObj['fromJSON'] === 'function') {
      anyObj['fromJSON'](jsonObj);
    } else {
      for (var propName in jsonObj) {
        anyObj[propName] = jsonObj[propName];
      }
    }

    return anyObj;
  }
}
