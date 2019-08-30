import * as Immutable from 'seamless-immutable';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        [action.payload.dataName]: Immutable(action.payload.data)
      };
    default:
      return state;
  }
};
