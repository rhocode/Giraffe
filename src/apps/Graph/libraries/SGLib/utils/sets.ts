export const setEquals = (oldSet: any, newSet: any) => {
  if (oldSet.size !== newSet.size) return false;
  for (const a of oldSet) if (!newSet.has(a)) return false;
  return true;
};
