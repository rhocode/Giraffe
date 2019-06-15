import * as d3 from "d3";

const initialState = {
  graphTransform: d3.zoomIdentity
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GRAPH_DATA':
      return {
        ...state,
        graphData: Object.assign({}, action.payload)
      };
    case 'SET_GRAPH_TRANSFORM':
      return {
        ...state,
        graphTransform: action.payload
      };
    default:
      return state;
  }
};
