export const setGraphData = data => dispatch => {
  dispatch({
    type: 'SET_GRAPH_DATA',
    payload: data
  });
};

export const setMouseMode = data => dispatch => {
  dispatch({
    type: 'SET_MOUSE_MODE',
    payload: data
  });
};

export const setGraphTransform = data => dispatch => {
  dispatch({
    type: 'SET_GRAPH_TRANSFORM',
    payload: data
  });
};

export const setDragStart = data => dispatch => {
  dispatch({
    type: 'SET_DRAG_START',
    payload: data
  });
};

export const setDragCurrent = data => dispatch => {
  dispatch({
    type: 'SET_DRAG_CURRENT',
    payload: data
  });
};

export const setGraphFidelity = data => dispatch => {
  dispatch({
    type: 'SET_GRAPH_FIDELITY',
    payload: data
  });
};