import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
import {routerReducer} from "react-router-redux";
import execution from "./execution/execution-reducer";
import method from "./method/method-reducer";
import executionCreate from "./execution/create/execution-create-reducer";
import {reducer as filter} from "./components/filter";
import executionDetail from "./execution/detail/execution-detail-reducer";
import scoreItemList from "./dashboard/score-item-list/score-item-list-reducer";
import datasetReducer from "./dataset/dataset-reducer";
import collectionReducer from "./collections/collection-reducer";
import scoreTabReducer from "./execution-detail/score/score-tab-reducer";

// http://redux.js.org/docs/api/combineReducers.html
const reducers = combineReducers({
    "form": formReducer,
    "routing": routerReducer,
    [execution.name]: execution.reducer,
    [method.name]: method.reducer,
    [executionCreate.name]: executionCreate.reducer,
    [filter.name]: filter.reducer,
    [executionDetail.name]: executionDetail.reducer,
    [scoreItemList.name]: scoreItemList.reducer,
    [datasetReducer.name]: datasetReducer.reducer,
    [collectionReducer.name] : collectionReducer.reducer,
    [scoreTabReducer.name] : scoreTabReducer.reducer
});

export default reducers;
