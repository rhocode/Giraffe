import * as protobuf from 'protobufjs/light';
import getLatestSchema from 'v3/data/utils/getLatestSchema';

export const latestProtobufRoot = () =>
  protobuf.Root.fromJSON(getLatestSchema());

const dataLoaderImpl = () => {
  const memoizedLoadData: Map<String, any> = new Map();
  return (filename: string, mapper: any) => {
    const key = filename + '-' + mapper.name;
    const fetchedData = memoizedLoadData.get(key);
    if (fetchedData) {
      return fetchedData;
    } else {
      const ItemList = latestProtobufRoot().lookupType(filename);
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
      memoizedLoadData.set(key, promise);
      return promise;
    }
  };
};

const dataRepository = dataLoaderImpl();

export default dataRepository;
