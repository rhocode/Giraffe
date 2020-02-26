import memoizedProtoSpecLoader, { protobufRoot } from 'v3/utils/protoUtils';

const initRuntime = () => {
  const ItemEnum = protobufRoot.lookupEnum('ItemEnum');
  const Recipe = protobufRoot.lookupType('Recipe');

  // console.log(ItemEnum)
  memoizedProtoSpecLoader('0.1.0').then((item: any) => {
    console.log(item);
  });
};

export default initRuntime;
