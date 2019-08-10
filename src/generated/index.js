import * as schemas from './__all';

let globalSchemas = {};
Object.keys(schemas.default).forEach(item => {
  const key = item.replace('generated_', '').toLowerCase();
  const version = key.replace('_schema', '').replace(/_/g, '.');
  globalSchemas[version] = schemas.default[item];
});

export default globalSchemas;
