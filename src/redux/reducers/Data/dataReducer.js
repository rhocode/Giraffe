import * as Immutable from 'seamless-immutable';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATA':
      const data = Immutable(action.payload.data);
      if (!state[action.payload.dataName])
        return {
          ...state,
          [action.payload.dataName]: data,
          [action.payload.dataName + '_original']: data
        };
      else {
        return {
          ...state,
          [action.payload.dataName]: data
        };
      }
    default:
      return state;
  }
};
