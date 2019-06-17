export const setUpdateAvailable = data => dispatch => {
  dispatch({
    type: 'SET_UPDATE_AVAILABLE',
    payload: data
  });
};