import {
    FETCH_EXECUTION_LIST_REQUEST,
    FETCH_EXECUTION_LIST_SUCCESS,
    FETCH_EXECUTION_DETAIL_REQUEST,
    FETCH_EXECUTION_DETAIL_SUCCESS,
    CLEAR_EXECUTION_DETAIL
} from "./execution-action";
import {
    STATUS_INITIAL,
    STATUS_FETCHING,
    STATUS_FETCHED
} from "./../service/data-access";

const REDUCER_NAME = "execution";

const INITIAL_STATE = {
    "list": {
        "status": STATUS_INITIAL,
        "data": undefined
    },
    "details": {}
};

const REDUCER = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_EXECUTION_LIST_REQUEST:
            return onFetchExecutionListRequest(state, action);
        case FETCH_EXECUTION_LIST_SUCCESS:
            return onFetchExecutionListSuccess(state, action);
        case FETCH_EXECUTION_DETAIL_REQUEST:
            return onFetchExecutionDetailRequest(state, action);
        case FETCH_EXECUTION_DETAIL_SUCCESS:
            return onFetchExecutionDetailSuccess(state, action);
        case CLEAR_EXECUTION_DETAIL:
            console.error("TODO : CLEAR_EXECUTION_DETAIL");
            return state;
        default:
            return state;
    }
};

export default {
    "name": REDUCER_NAME,
    "reducer": REDUCER
};

function onFetchExecutionListRequest(state) {
    return {
        ...state,
        "list": {
            "status": STATUS_FETCHING,
            "data": undefined
        }
    };
}

function onFetchExecutionListSuccess(state, action) {
    return {
        ...state,
        "list": {
            "status": STATUS_FETCHED,
            "data": action.data
        }
    };
}

function onFetchExecutionDetailRequest(state, action) {
    return {
        ...state,
        "details": {
            [action.id]: {
                "status": STATUS_FETCHING,
                "data": undefined
            }
        }
    };
}

function onFetchExecutionDetailSuccess(state, action) {
    return {
        ...state,
        "details": {
            [action.id]: {
                "status": STATUS_FETCHED,
                "data": action.data
            }
        }
    };
}

const executionSelector = state => state[REDUCER_NAME];

export function executionListSelector(state) {
    return executionSelector(state).list;
}

export function executionDetailSelector(state, id) {
    return executionSelector(state).details[id];
}
