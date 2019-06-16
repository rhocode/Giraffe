export const setGraphData = data => dispatch => {
  dispatch({
    type: 'SET_GRAPH_DATA',
    payload: data
  });
};

export const setGraphTransform = data => dispatch => {
  dispatch({
    type: 'SET_GRAPH_TRANSFORM',
    payload: data
  });
};

export const setGraphFidelity = data => dispatch => {
  dispatch({
    type: 'SET_GRAPH_FIDELITY',
    payload: data
  });
};