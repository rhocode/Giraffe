export const getClassName = (obj: any): string => {
  return obj
    .toString()
    .split('(' || /s+/)[0]
    .split(' ' || /s+/)[1];
};
