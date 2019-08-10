const initialState = {
  localChanges: {}
};

const addLocalChange = (action, state) => {
  const { table, object, key, value } = action.payload;
  let localChanges = state.localChanges || {};
  localChanges = JSON.parse(JSON.stringify(localChanges));
  localChanges[table] = localChanges[table] || {};
  localChanges[table][object] = localChanges[table][object] || {};
  localChanges[table][object][key] = value;
  return {
    ...state,
    localChanges
  };
};

const removeLocalChange = (action, state) => {
  const { table, object, key } = action.payload;
  let localChanges = state.localChanges || {};
  if (
    !localChanges[table] ||
    !localChanges[table][object] ||
    !localChanges[table][object][key]
  ) {
    return state;
  }

  delete localChanges[table][object][key];
  if (Object.keys(localChanges[table][object]).length === 0) {
    delete localChanges[table][object];
    if (Object.keys(localChanges[table]).length === 0) {
      delete localChanges[table];
    }
  }

  return {
    ...state,
    localChanges: JSON.parse(JSON.stringify(localChanges))
  };
};

const removeLocalChangeForTableRow = (action, state) => {
  const { table, object } = action.payload;

  let localChanges = state.localChanges || {};
  if (!localChanges[table] || !localChanges[table][object]) {
    return state;
  }

  delete localChanges[table][object];
  if (Object.keys(localChanges[table]).length === 0) {
    delete localChanges[table];
  }

  return {
    ...state,
    localChanges: Object.assign({}, localChanges)
  };
};

const addTableRow = (action, state) => {
  const { table, object, key, data } = action.payload;

  let localChanges = state.localChanges || {};
  localChanges = JSON.parse(JSON.stringify(localChanges));
  localChanges[table] = localChanges[table] || {};
  localChanges[table][object] = localChanges[table][object] || {};

  if (localChanges[table][object][key] === undefined) {
    localChanges[table][object][key] = data.getEntriesByField(key) + 1;
  } else {
    localChanges[table][object][key]++;
  }

  return {
    ...state,
    localChanges: Object.assign({}, localChanges)
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_LOCAL_CHANGE':
      return addLocalChange(action, state);
    case 'REMOVE_LOCAL_CHANGE':
      return removeLocalChange(action, state);
    case 'REMOVE_LOCAL_CHANGE_FOR_TABLE':
    case 'REMOVE_LOCAL_CHANGE_FOR_TABLE_ROW':
      return removeLocalChangeForTableRow(action, state);
    case 'ADD_TABLE_ROW':
      return addTableRow(action, state);
    case 'REMOVE_TABLE_ROW':
      return removeLocalChangeForTableRow(action, state);
    default:
      return state;
  }
};
