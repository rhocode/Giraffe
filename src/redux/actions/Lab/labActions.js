export const addLocalChange = data => dispatch => {
  dispatch({
    type: 'ADD_LOCAL_CHANGE',
    payload: data
  });
};

export const removeLocalChange = data => dispatch => {
  dispatch({
    type: 'REMOVE_LOCAL_CHANGE',
    payload: data
  });
};

export const removeAllLocalChangesForTableRow = data => dispatch => {
  dispatch({
    type: 'REMOVE_LOCAL_CHANGE_FOR_TABLE_ROW',
    payload: data
  });
};

export const removeAllLocalChangesForTable = data => dispatch => {
  dispatch({
    type: 'REMOVE_LOCAL_CHANGE_FOR_TABLE',
    payload: data
  });
};

export const addTableRow = data => dispatch => {
  dispatch({
    type: 'ADD_TABLE_ROW',
    payload: data
  });
};

export const removeTableRow = data => dispatch => {
  dispatch({
    type: 'REMOVE_TABLE_ROW',
    payload: data
  });
};
