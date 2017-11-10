import {fetchJsonAndDispatch} from "./../service/data-access";

export const CLEAR_METHOD_LIST = "CLEAR_METHOD_LIST";
export const FETCH_METHOD_LIST_REQUEST = "FETCH_METHOD_PAGE_REQUEST";
export const FETCH_METHOD_LIST_SUCCESS = "FETCH_METHOD_PAGE_SUCCESS";

export const CLEAR_METHODS_DETAILS = "CLEAR_METHOD_DETAIL";
export const FETCH_METHOD_DETAIL_REQUEST = "FETCH_METHOD_DETAIL_REQUEST";
export const FETCH_METHOD_DETAIL_SUCCESS = "FETCH_METHOD_DETAIL_SUCCESS";

// TODO Add support for fail action.

export function clearMethodList() {
    return {
        "type": CLEAR_METHOD_LIST
    };
}

export function fetchMethodList() {
    // TODO Add check for loading.
    return (dispatch) => {
        dispatch(fetchMethodListRequest());
        const url = "/api/v1/resources/methods";
        fetchJsonAndDispatch(url, dispatch, fetchMethodListSuccess);
    };
}

function fetchMethodListRequest() {
    return {
        "type": FETCH_METHOD_LIST_REQUEST,
    };
}

function fetchMethodListSuccess(data) {
    return {
        "type": FETCH_METHOD_LIST_SUCCESS,
        "data": data
    }
}

export function clearMethodsDetail() {
    return {
        "type": CLEAR_METHODS_DETAILS
    };
}

// TODO Introduce to global level.
const methodFetchingList = {};

export function fetchMethodDetail(id) {
    // TODO Add check for loading.
    return (dispatch) => {
        if (methodFetchingList[id] !== undefined) {
            return;
        }
        dispatch(fetchMethodDetailRequest(id));
        const url = "/api/v1/resources/methods/" + id;
        fetchJsonAndDispatch(url, dispatch, fetchMethodDetailSuccess);
    };
}

function fetchMethodDetailRequest(id) {
    methodFetchingList[id] = 1;
    return {
        "type": FETCH_METHOD_DETAIL_REQUEST,
        "id": id
    };
}

function fetchMethodDetailSuccess(data) {
    const id = data["metadata"]["id"];
    methodFetchingList[id] = undefined;
    return {
        "type": FETCH_METHOD_DETAIL_SUCCESS,
        "id": id,
        "data": data
    }
}
