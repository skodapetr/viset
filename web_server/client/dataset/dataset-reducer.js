import {
    FETCH_DATASET_LIST_REQUEST,
    FETCH_DATASET_LIST_SUCCESS
} from "./dataset-action";
import {
    STATUS_INITIAL,
    STATUS_FETCHING,
    STATUS_FETCHED
} from "./../service/data-access";

const REDUCER_NAME = "datasets";

const INITIAL_STATE = {
    "list": {
        "status": STATUS_INITIAL,
        "data": undefined
    }
};

const REDUCER = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_DATASET_LIST_REQUEST:
            return onFetchDatasetListRequest(state, action);
        case FETCH_DATASET_LIST_SUCCESS:
            return onFetchDatasetListSuccess(state, action);
        default:
            return state;
    }
};

export default {
    "name": REDUCER_NAME,
    "reducer": REDUCER
};

function onFetchDatasetListRequest(state) {
    return {
        ...state,
        "list": {
            "status": STATUS_FETCHING,
            "data": undefined
        }
    };
}

function onFetchDatasetListSuccess(state, action) {
    return {
        ...state,
        "list": {
            "status": STATUS_FETCHED,
            "data": action.data
        }
    };
}

const reducerSelector = state => state[REDUCER_NAME];

export function datasetListSelector(state) {
    return reducerSelector(state).list;
}
