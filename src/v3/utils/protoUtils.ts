import * as protobuf from 'protobufjs/light';
import schemas from '../../generated';
import {
  getAllVersions,
  getLatestVersion
} from '../data/utils/getLatestSchema';
import { toUint8Array } from 'v3/apps/GraphV3/libraries/SatisGraphtoryLib/sourcetools/base64';
import * as LZUTF8 from 'lzutf8';
import { decode } from '@msgpack/msgpack';
import * as memoize from 'fast-memoize';

const constrainedSchemas: any = schemas;

export const protobufRoot = protobuf.Root.fromJSON(
  constrainedSchemas[getLatestVersion()]
);

const protoSpecLoader = (version: string) => {
  if (!getAllVersions().includes(version)) {
    throw new Error('Invalid version');
  }

  const SGProtoData = protobufRoot.lookupType('satisgraphtory.SGProtoData');

  return fetch(`${process.env.PUBLIC_URL}/proto/${version}/data.s2`)
    .then(data => data.json())
    .then(data => data.d)
    .then(data => toUint8Array(data))
    .then(data => LZUTF8.decompress(data))
    .then(data => toUint8Array(data))
    .then(data => decode(data))
    .then((data: any) => {
      return SGProtoData.toObject(SGProtoData.fromObject(data), {
        enums: String
      });
    });
};

// @ts-ignore
const memoizedProtoSpecLoader: any = memoize(protoSpecLoader);

export default memoizedProtoSpecLoader;
