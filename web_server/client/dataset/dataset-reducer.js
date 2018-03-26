import {
    FETCH_DATASET_LIST_REQUEST,
    FETCH_DATASET_LIST_SUCCESS,
    FETCH_DATASET_DETAIL_REQUEST,
    FETCH_DATASET_DETAIL_SUCCESS,
    DOWNLOAD_REQUEST
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
    },
    "details": {}
};

const REDUCER = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_DATASET_LIST_REQUEST:
            return onFetchDatasetListRequest(state, action);
        case FETCH_DATASET_LIST_SUCCESS:
            return onFetchDatasetListSuccess(state, action);
        case FETCH_DATASET_DETAIL_REQUEST:
            return onFetchDatasetDetailRequest(state, action);
        case FETCH_DATASET_DETAIL_SUCCESS:
            return onFetchDatasetDetailSuccess(state, action);
        case DOWNLOAD_REQUEST:
            return onDownloadRequest(state, action);
        default:
            return state;
    }
};

export default {
    "name": REDUCER_NAME,
    "reducer": REDUCER
};

function onFetchDatasetListRequest(state) {
    // TODO Extract to a template repository class.
    return {
        ...state,
        "list": {
            "status": STATUS_FETCHING,
            "data": undefined
        }
    };
}

function onFetchDatasetListSuccess(state, action) {
    // TODO Extract to a template repository class.
    return {
        ...state,
        "list": {
            "status": STATUS_FETCHED,
            "data": action.data
        }
    };
}

function onFetchDatasetDetailRequest(state, action) {
    // TODO Extract to a template repository class.
    return {
        ...state,
        "details": {
            ...state["details"],
            [action.id]: {
                "status": STATUS_FETCHING,
                "data": undefined
            }
        }
    };
}

function onFetchDatasetDetailSuccess(state, action) {
    // TODO Extract to a template repository class.
    return {
        ...state,
        "details": {
            ...state["details"],
            [action.id]: {
                "status": STATUS_FETCHED,
                "data": action.data
            }
        }
    };
}

function onDownloadRequest(state, action) {
    const datasetDetail = state.details[action.id].data;

    return {
        ...state,
        "details": {
            ...state["details"],
            [action.id]: {
                "status": STATUS_FETCHED,
                "data": {
                    ... datasetDetail,
                    "downloading": true
                }
            }
        }
    };
}

const reducerSelector = state => state[REDUCER_NAME];

export function datasetListSelector(state) {
    return reducerSelector(state).list;
}

export function datasetDetailSelector(state, id) {
    return reducerSelector(state).details[id];
}
