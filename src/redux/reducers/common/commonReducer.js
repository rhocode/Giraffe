const initialState = {
  updateAvailable: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_UPDATE_AVAILABLE':
      return {
        ...state,
        updateAvailable: action.payload
      };
    default:
      return state;
  }
};
