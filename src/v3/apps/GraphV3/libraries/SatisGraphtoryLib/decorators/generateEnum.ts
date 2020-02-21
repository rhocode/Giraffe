import { getClassName } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/sourcetools/getClassName';

//TODO: re-consolidate enums from existing sources.

const enumMax: Map<string, number> = new Map();
const enumMap: Map<string, Map<string, number>> = new Map();

export function toProtoBufFromGeneratedEnum(className: string) {
  const dataList: string[] = [];

  [...(enumMap.get(className) ?? new Map<string, number>()).entries()].forEach(
    ([key, value]: [string, number]): void => {
      dataList.push(`"${key}": ${value}`);
    }
  );

  return `
        "${className}": {
          "values": {
            ${dataList.join(',\n            ')}
          }
        }`;
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

      constructor(...args: any[]) {
        super(...args);
        this.__internalClass = classNameRaw;
        const property = this[fieldName];
        if (property) {
          if (!enumMap.get(className)) {
            enumMax.set(className, -1);
            enumMap.set(className, new Map());
          }

          this.propertyName = property;

          const fetchedEnumMax = enumMax.get(className)!;
          const fetchedEnumMap = enumMap.get(className)!;

          if (fetchedEnumMap.has(property)) return;

          enumMax.set(className, fetchedEnumMax + 1);
          fetchedEnumMap.set(property, fetchedEnumMax + 1);
        }
      }

      public toEnum(): number {
        const name =
          Object.getPrototypeOf(Object.getPrototypeOf(this))?.constructor
            ?.name ?? '';
        const thisEnumMap = enumMap.get(name) ?? new Map<string, number>();
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
