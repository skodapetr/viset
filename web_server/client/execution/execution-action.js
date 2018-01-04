import {fetchJsonAndDispatch} from "./../service/data-access";

export const FETCH_EXECUTION_LIST_REQUEST = "FETCH_EXECUTION_LIST_REQUEST";
export const FETCH_EXECUTION_LIST_SUCCESS = "FETCH_EXECUTION_LIST_SUCCESS";

export const FETCH_EXECUTION_DETAIL_REQUEST = "FETCH_EXECUTION_DETAIL_REQUEST";
export const FETCH_EXECUTION_DETAIL_SUCCESS = "FETCH_EXECUTION_DETAIL_SUCCESS";

export const CLEAR_EXECUTION_DETAIL = "CLEAR_EXECUTION_DETAIL";

export function fetchExecutions() {
    return (dispatch) => {
        dispatch(fetchExecutionsRequest());
        const url = "/api/v1/resources/executions";
        fetchJsonAndDispatch(url, dispatch, fetchExecutionsSuccess)
    };
}

function fetchExecutionsRequest() {
    return {
        "type": FETCH_EXECUTION_LIST_REQUEST,
    };
}

function fetchExecutionsSuccess(data) {
    return {
        "type": FETCH_EXECUTION_LIST_SUCCESS,
        "data": data
    }
}

export function fetchExecution(id) {
    return (dispatch) => {
        dispatch(fetchExecutionRequest(id));
        const url = "/api/v1/resources/executions/" + id;
        fetchJsonAndDispatch(url, dispatch, fetchExecutionSuccess)
    };
}

function fetchExecutionRequest(id) {
    return {
        "type": FETCH_EXECUTION_DETAIL_REQUEST,
        "id": id
    };
}

function fetchExecutionSuccess(data) {
    return {
        "type": FETCH_EXECUTION_DETAIL_SUCCESS,
        "data": data,
        "id": data.id
    }
}

export function clearExecution(id) {
    return {
        "type": CLEAR_EXECUTION_DETAIL,
        "id": id
    }
}
