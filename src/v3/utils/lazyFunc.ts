/* Delete This */
const lazyFunc = (func: Function): any => {
  let retVal: any = undefined;
  return () => {
    if (retVal === undefined) {
      retVal = func();
    }
    return retVal;
  };
};

export default lazyFunc;
