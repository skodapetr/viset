import {
    FETCH_COLLECTION_LIST_REQUEST,
    FETCH_COLLECTION_LIST_SUCCESS,
    FETCH_COLLECTION_DETAIL_REQUEST,
    FETCH_COLLECTION_DETAIL_SUCCESS,
    DELETE_COLLECTION_DETAIL
} from "./collection-action";
import {
    STATUS_INITIAL,
    STATUS_FETCHING,
    STATUS_FETCHED
} from "./../service/data-access";

const REDUCER_NAME = "collection";

const INITIAL_STATE = {
    "list": {
        "status": STATUS_INITIAL,
        "data": undefined
    },
    "details": {}
};

const REDUCER = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_COLLECTION_LIST_REQUEST:
            return onFetchCollectionListRequest(state);
        case FETCH_COLLECTION_LIST_SUCCESS:
            return onFetchCollectionListSuccess(state, action);
        case FETCH_COLLECTION_DETAIL_REQUEST:
            return onFetchCollectionDetailRequest(state, action);
        case FETCH_COLLECTION_DETAIL_SUCCESS:
            return onFetchCollectionDetailSuccess(state, action);
        case DELETE_COLLECTION_DETAIL:
            return onDeleteCollectionDetail(state, action);
        default:
            return state;
    }
};

export default {
    "name": REDUCER_NAME,
    "reducer": REDUCER
};

function onFetchCollectionListRequest(state) {
    return {
        ...state,
        "list": {
            "status": STATUS_FETCHING,
            "data": undefined
        }
    };
}

function onFetchCollectionListSuccess(state, action) {
    return {
        ...state,
        "list": {
            "status": STATUS_FETCHED,
            "data": action.data
        }
    };
}

function onFetchCollectionDetailRequest(state, action) {
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

function onFetchCollectionDetailSuccess(state, action) {
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

function onDeleteCollectionDetail(state, action) {
    // TODO Remove values from array do not just set it to null.
    return {
        ...state,
        "details" : {
            ...state["details"],
            [action.id] : null
        }
    }
}

const reducerSelector = state => state[REDUCER_NAME];

export function collectionListSelector(state) {
    return reducerSelector(state).list;
}

export function collectionDetailSelector(state, id) {
    return reducerSelector(state).details[id];
}
