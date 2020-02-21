import { allGqlTypes } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/decorators/gqlType';

export default abstract class ProtoBufable {
  static toProtoBuf() {
    // if (typeof )
    console.log(this);
    const className = this.toString()
      .split('(' || /s+/)[0]
      .split(' ' || /s+/)[1];
    const fields = allGqlTypes.get(className) ?? new Map<string, string>();
    console.log(className);
    return fields.toString();
  }
}
