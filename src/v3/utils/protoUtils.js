import lazyFunc from './lazyFunc';
import * as protobuf from 'protobufjs/light';
import schemas from '../../generated';
import { getLatestSchemaName } from '../data/utils/getLatestSchema';

export const protobufRoot = lazyFunc(() =>
  protobuf.Root.fromJSON(schemas[getLatestSchemaName()])
);

const loadProtoDataFunc = () => {
  const memoizedLoadData = {};
  return (filename, mapper) => {
    const key = filename + '-' + mapper.name;
    if (memoizedLoadData[key]) {
      return memoizedLoadData[key];
    } else {
      const ItemList = protobufRoot().lookupType(filename);
      const promise = fetch(
        `${process.env.PUBLIC_URL}/proto/0.1.0/${filename}.s2`
      )
        .then(data => data.arrayBuffer())
        .then(buffer => new Uint8Array(buffer))
        .then(buffer => {
          return ItemList.decode(buffer);
        })
        .then(data => ItemList.toObject(data).data)
        .then(data => mapper(data));
      memoizedLoadData[key] = promise;
      return promise;
    }
  };
};

export const loadProtoData = loadProtoDataFunc();
