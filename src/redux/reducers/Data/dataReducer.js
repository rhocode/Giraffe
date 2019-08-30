const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        [action.payload.dataName]: Object.assign({}, action.payload.data)
      };
    default:
      return state;
  }
};
