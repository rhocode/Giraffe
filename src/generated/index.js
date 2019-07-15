function importAll(r) {
  let schemas = {};
  r.keys().forEach((item) => {
    const schema = r(item);
    schemas[item.replace('./', '').toLowerCase().slice(0, -12)] = schema;
  });
  return schemas;
}

// eslint-disable-next-line
const schemas = importAll(
  require.context('./', false, /\.json$/)
);

export default schemas;