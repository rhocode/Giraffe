const initialState = {
  blah: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GRAPH_DATA':
      return {
        graphData: action.payload,
        ...state
      };
    default:
      return state;
  }
};
