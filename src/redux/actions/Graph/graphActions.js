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

export const setMachineClasses = data => dispatch => {
  dispatch({
    type: 'SET_MACHINE_CLASSES',
    payload: data
  });
};

export const setSelectedMachine = data => dispatch => {
  dispatch({
    type: 'SET_SELECTED_MACHINE',
    payload: data
  });
};

export const addOpenedModal = () => dispatch => {
  dispatch({
    type: 'ADD_OPENED_MODAL'
  });
};

export const closeOpenedModal = () => dispatch => {
  dispatch({
    type: 'CLOSE_OPENED_MODAL'
  });
};

export const setGraphSourceNode = data => dispatch => {
  dispatch({
    type: 'SET_GRAPH_SOURCE_NODE',
    payload: data
  });
};
