import getLatestSchema from '../../utils/getLatestSchema';
import serialize from './serialize';

it('Serializes properly', () => {
  const schema = getLatestSchema();
  serialize(schema, {});
});
