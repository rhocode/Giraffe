export const setGraphData = data => dispatch => {
  dispatch({
    type: 'SET_GRAPH_DATA',
    payload: data
  });
};
