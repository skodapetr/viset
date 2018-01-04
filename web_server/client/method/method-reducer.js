import {
    FETCH_METHOD_LIST_REQUEST,
    FETCH_METHOD_LIST_SUCCESS,
    FETCH_METHOD_DETAIL_REQUEST,
    FETCH_METHOD_DETAIL_SUCCESS
} from "./method-action";
import {
    STATUS_INITIAL,
    STATUS_FETCHING,
    STATUS_FETCHED
} from "./../service/data-access";

const REDUCER_NAME = "method";

const INITIAL_STATE = {
    "list": {
        "status": STATUS_INITIAL,
        "data": undefined
    },
    "details": {}
};

const REDUCER = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_METHOD_LIST_REQUEST:
            return onFetchMethodListRequest(state);
        case FETCH_METHOD_LIST_SUCCESS:
            return onFetchMethodListSuccess(state, action);
        case FETCH_METHOD_DETAIL_REQUEST:
            return onFetchMethodDetailRequest(state, action);
        case FETCH_METHOD_DETAIL_SUCCESS:
            return onFetchMethodDetailSuccess(state, action);
        default:
            return state;
    }
};

export default {
    "name": REDUCER_NAME,
    "reducer": REDUCER
};

function onFetchMethodListRequest(state) {
    return {
        ...state,
        "list": {
            "status": STATUS_FETCHING,
            "data": undefined
        }
    };
}

function onFetchMethodListSuccess(state, action) {
    return {
        ...state,
        "list": {
            "status": STATUS_FETCHED,
            "data": action.data
        }
    };
}

function onFetchMethodDetailRequest(state, action) {
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

function onFetchMethodDetailSuccess(state, action) {
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

const methodSelector = state => state[REDUCER_NAME];

export function methodListSelector(state) {
    return methodSelector(state).list;
}

export function methodDetailSelector(state, id) {
    return methodSelector(state).details[id];
}
