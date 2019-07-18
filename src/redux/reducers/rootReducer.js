import {combineReducers} from 'redux';
import simpleReducer from './simpleReducer';
import graphReducer from './Graph/graphReducer';
import labReducer from './Lab/labReducer';
import commonReducer from './common/commonReducer';
import {localizeReducer} from 'react-localize-redux';

export default combineReducers({
  simpleReducer,
  graphReducer,
  labReducer,
  commonReducer,
  localize: localizeReducer
});
