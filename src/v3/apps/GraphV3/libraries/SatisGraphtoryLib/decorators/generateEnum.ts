import { getClassName } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/sourcetools/getClassName';
import ProtoBufable from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/classes/objects/abstract/protoBufable';
import gqlType from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';

//TODO: re-consolidate enums from existing sources.

const enumMax: Map<string, number> = new Map();
export const globalEnumMap: Map<string, Map<string, number>> = new Map();
export const globalEnumLookup: Map<string, Map<string, object>> = new Map();

export function enumToProtoBuf(cls: ProtoBufable) {
  let next = cls;

  if (
    cls
      .toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1] === 'EnumWrapper'
  ) {
    next = Object.getPrototypeOf(cls);
  }

  const className = next
    .toString()
    .split('(' || /s+/)[0]
    .split(' ' || /s+/)[1];

  let generatedProtos: any = {
    [`Invalid${className}`]: 0
  };

  const generatedProto = [
    ...(globalEnumMap.get(className) ?? new Map<string, number>()).entries()
  ].map(([key, value]: [string, number], index): object => {
    return {
      [key]: value
    };
  });

  generatedProtos = {
    ...generatedProtos,
    ...Object.assign({}, ...generatedProto)
  };

  return {
    [className + 'Enum']: {
      values: {
        ...generatedProtos
      }
    }
  };
}

export function translateEnumToObject(
  cls: ProtoBufable | string,
  enumStr: string
) {
  let className = cls;

  if (typeof cls !== 'string') {
    let next = cls;

    if (
      cls
        .toString()
        .split('(' || /s+/)[0]
        .split(' ' || /s+/)[1] === 'EnumWrapper'
    ) {
      next = Object.getPrototypeOf(cls);
    }

    className = next
      .toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];
  }

  const fetcher = globalEnumLookup.get(className as string)!.get(enumStr);
  if (fetcher === undefined)
    throw new Error(`Undefined enum ${enumStr} in ${className}`);
  return fetcher;
}

export default function generateEnum(
  fieldName: string,
  typeOverride: string = ''
) {
  return function<T extends { new (...args: any[]): any }>(constructor: T) {
    const classNameRaw = getClassName(constructor);

    const className = typeOverride === '' ? classNameRaw : typeOverride;

    class EnumWrapper extends constructor {
      private readonly propertyName: string = '';
      private readonly __internalClass: string;

      @gqlType(className + 'Enum')
      public enumValue: number = 0;

      constructor(...args: any[]) {
        super(...args);
        this.__internalClass = classNameRaw;
        const property = this[fieldName];
        if (property !== undefined) {
          if (globalEnumMap.get(className) === undefined) {
            enumMax.set(className, 0);
            globalEnumMap.set(className, new Map());
            globalEnumLookup.set(className, new Map());
          }

          this.propertyName = property;

          const fetchedEnumMax = enumMax.get(className)!;
          const fetchedEnumMap = globalEnumMap.get(className)!;
          const fetchedEnumObjectMap = globalEnumLookup.get(className)!;

          if (fetchedEnumMap.has(property)) return;

          const newNumber = fetchedEnumMax + 1;
          enumMax.set(className, newNumber);
          fetchedEnumMap.set(property, newNumber);
          fetchedEnumObjectMap.set(property, this);
          this.enumValue = newNumber;
        }
      }

      public toEnum(): number {
        const name =
          Object.getPrototypeOf(Object.getPrototypeOf(this))?.constructor
            ?.name ?? '';
        const thisEnumMap =
          globalEnumMap.get(name) ?? new Map<string, number>();
        if (
          !name ||
          !this.propertyName ||
          thisEnumMap.get(this.propertyName) === undefined
        ) {
          return -1;
        }

        return thisEnumMap.get(this.propertyName) ?? 0;
      }
    }

    return EnumWrapper;
  };
}
