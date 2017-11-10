import {
    CLEAR_METHOD_LIST,
    FETCH_METHOD_LIST_REQUEST,
    FETCH_METHOD_LIST_SUCCESS,
    CLEAR_METHODS_DETAILS,
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
    "details": {},
    "list": {
        "status": STATUS_INITIAL,
        "data": undefined
    }
};

// TODO Introduce some general patter for "resource" handling.

const REDUCER = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CLEAR_METHOD_LIST:
            return {
                ...state,
                "list": clearMethodList()
            };
        case FETCH_METHOD_LIST_REQUEST:
            return {
                ...state,
                "list": fetchMethodListRequest()
            };
        case FETCH_METHOD_LIST_SUCCESS:
            return {
                ...state,
                "list": fetchMethodListSuccess(action)
            };
        case CLEAR_METHODS_DETAILS:
            return {
                ...state,
                "details": clearMethodsDetail()
            };
        case FETCH_METHOD_DETAIL_REQUEST:
            return {
                ...state,
                "details": fetchMethodDetailRequest(state["details"], action)
            };
        case FETCH_METHOD_DETAIL_SUCCESS:
            return {
                ...state,
                "details": fetchMethodDetailSuccess(state["details"], action)
            };
        default:
            return state;
    }
};

export default {
    "name" : REDUCER_NAME,
    "reducer": REDUCER
};

function clearMethodList() {
    return {
        "status": STATUS_INITIAL,
        "data": undefined
    };
}

function fetchMethodListRequest() {
    return {
        "status": STATUS_FETCHING,
        "data": undefined
    };
}

function fetchMethodListSuccess(action) {
    return {
        "status": STATUS_FETCHED,
        "data": action["data"]
    };
}

function clearMethodsDetail() {
    return {};
}

function fetchMethodDetailRequest(state, action) {
    return {
        ...state,
        [action["id"]]: {
            "status": STATUS_FETCHING,
            "data": undefined
        }
    };
}

function fetchMethodDetailSuccess(state, action) {
    return {
        ...state,
        [action["id"]]: {
            "status": STATUS_FETCHED,
            "data": action["data"]
        }
    };
}

// TODO Add selector for a single item, use indexes in the list. Thus if the item model change just the selector need to be updated not the user interface.

export function selectListLoading(state) {
    return selectList(state).status !== STATUS_FETCHED;
}

function selectList(state) {
    return state.method.list;
}

export function selectListData(state) {
    return selectList(state).data;
}

export function selectDetailLoading(state, id) {
    const detail = selectDetail(state, id);
    return detail === undefined || detail.status !== STATUS_FETCHED;
}

function selectDetail(state, id) {
    return state.method.details[id];
}

export function selectDetailsLoading(state, ids) {
    for (let id in ids) {
        if (selectDetailLoading(state, ids)) {
            return true;
        }
    }
    return false;
}

export function selectDetailData(state, id) {
    const detail = selectDetail(state, id);
    if (detail === undefined) {
        return undefined;
    } else {
        return detail.data;
    }
}
