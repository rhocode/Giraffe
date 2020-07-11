export const localizeGenerator = (obj: any) => {
  const translation = {};
  Object.keys(obj).forEach((key) => {
    const value = (obj as any)[key].name as string;
    if (value) {
      (translation as any)[key] = value.replace(/^Alternate: /g, '');
    }
  });

  console.log(JSON.stringify(translation, null, 2));
};
