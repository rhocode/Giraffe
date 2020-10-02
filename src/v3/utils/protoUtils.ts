/* Delete This */
import * as protobuf from 'protobufjs/light';
import { toUint8Array } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/sourcetools/base64';
import * as LZUTF8 from 'lzutf8';
import * as memoize from 'fast-memoize';

const constrainedSchemas: any = {};

export const protobufRoot = protobuf.Root.fromJSON(constrainedSchemas);

const protoSpecLoader = (version: string) => {
  const SGProtoData = protobufRoot.lookupType('satisgraphtory.SGProtoData');

  return fetch(`${process.env.PUBLIC_URL}/proto/${version}/data.s2`)
    .then((data) => data.json())
    .then((data) => data.d)
    .then((data) => toUint8Array(data))
    .then((data) => LZUTF8.decompress(data))
    .then((data) => toUint8Array(data))
    .then((data: any) => {
      return SGProtoData.toObject(SGProtoData.fromObject(data), {
        enums: String,
      });
    });
};

// @ts-ignore
const memoizedProtoSpecLoader: any = memoize(protoSpecLoader);

export default memoizedProtoSpecLoader;
