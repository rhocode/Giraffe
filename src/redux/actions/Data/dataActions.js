export const setEditorData = data => dispatch => {
  dispatch({
    type: 'SET_DATA',
    payload: data
  });
};
