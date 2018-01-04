import {fetchJsonAndDispatch} from "./../service/data-access";
import {shouldNotBeFetchedSelector} from "./../service/repository";

// TODO Add support for clear action for methods.

export const FETCH_METHOD_LIST_REQUEST = "FETCH_METHOD_PAGE_REQUEST";
export const FETCH_METHOD_LIST_SUCCESS = "FETCH_METHOD_PAGE_SUCCESS";

export const FETCH_METHOD_DETAIL_REQUEST = "FETCH_METHOD_DETAIL_REQUEST";
export const FETCH_METHOD_DETAIL_SUCCESS = "FETCH_METHOD_DETAIL_SUCCESS";

export function fetchMethods() {
    return (dispatch, getStatus) => {
        const entity = getStatus().method.list;
        if (shouldNotBeFetchedSelector(entity)) {
            console.log("Ignoring fetch for method list.");
            return;
        }
        dispatch(fetchMethodsRequest());
        const url = "/api/v1/resources/methods";
        fetchJsonAndDispatch(url, dispatch, fetchMethodsSuccess);
    };
}

function fetchMethodsRequest() {
    return {
        "type": FETCH_METHOD_LIST_REQUEST,
    };
}

function fetchMethodsSuccess(data) {
    return {
        "type": FETCH_METHOD_LIST_SUCCESS,
        "data": data
    }
}

export function fetchMethod(id) {
    return (dispatch, getStatus) => {
        const entity = getStatus().method.details[id];
        if (shouldNotBeFetchedSelector(entity)) {
            console.log("Ignoring fetch for method detail.");
            return;
        }
        dispatch(fetchMethodRequest(id));
        const url = "/api/v1/resources/methods/" + id;
        fetchJsonAndDispatch(url, dispatch, fetchMethodSuccess);
    };
}

function fetchMethodRequest(id) {
    return {
        "type": FETCH_METHOD_DETAIL_REQUEST,
        "id": id
    };
}

function fetchMethodSuccess(data) {
    return {
        "type": FETCH_METHOD_DETAIL_SUCCESS,
        "id": data["metadata"]["id"],
        "data": data
    }
}
