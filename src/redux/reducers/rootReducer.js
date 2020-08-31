import { localizeReducer } from "react-localize-redux";
import { combineReducers } from "redux";

export default combineReducers({
  localize: localizeReducer,
});
