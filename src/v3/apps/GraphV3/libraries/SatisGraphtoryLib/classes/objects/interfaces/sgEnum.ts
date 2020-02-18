import ProtoBufable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/abstract/protoBufable';

export default abstract class SgEnum<T> extends ProtoBufable {
  value: T;
  __internalName: string;
  __internalObject: T;

  // @ts-ignore
  protected constructor(abs: typeof T, str: string) {
    super();
    let retrievedValue = (abs as any)[str];
    if (retrievedValue === undefined) {
      console.error('ResourceForm requires new enum', retrievedValue);
    }
    this.value = retrievedValue;
    this.__internalName = str;
    this.__internalObject = abs;
  }

  toProtoBufSegment(): string {
    const dataList: string[] = [];
    this.getAllEnums((rfKey: string) =>
      dataList.push(`"${rfKey}": ${(this.__internalObject as any)[rfKey]}`)
    );

    return `
        "${this.constructor.name}": {
          "values": {
            ${dataList.join(',\n            ')}
          }
        }`;
  }

  abstract getAllEnums(cb: Function): void;
}
