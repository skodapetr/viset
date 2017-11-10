import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
import {routerReducer} from "react-router-redux";
import execution from "./execution/execution-reducer";
import method from "./method/method-reducer";

// http://redux.js.org/docs/api/combineReducers.html
const reducers = combineReducers({
    "form": formReducer,
    "routing": routerReducer,
    [execution.name]: execution.reducer,
    [method.name]: method.reducer
});

export default reducers;
