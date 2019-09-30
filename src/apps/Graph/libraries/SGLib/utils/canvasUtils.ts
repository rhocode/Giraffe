export const withSavedContext = (context: any, callback: any) => {
  context.save();
  callback();
  context.restore();
};
