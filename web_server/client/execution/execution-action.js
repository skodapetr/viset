import {fetchJson, fetchJsonAndDispatch} from "../service/data-access";

// TODO Split to multiple files ?

export const CLEAR_EXECUTION_LIST = "CLEAR_EXECUTION_LIST_LIST";
export const FETCH_EXECUTION_LIST_REQUEST = "FETCH_EXECUTION_LIST_REQUEST";
export const FETCH_EXECUTION_LIST_SUCCESS = "FETCH_EXECUTION_LIST_SUCCESS";

export const CLEAR_EXECUTION_DETAIL_LIST = "CLEAR_EXECUTION_DETAIL_LIST";
export const FETCH_EXECUTION_DETAIL_REQUEST = "FETCH_EXECUTION_DETAIL_REQUEST";
export const FETCH_EXECUTION_DETAIL_SUCCESS = "FETCH_EXECUTION_DETAIL_SUCCESS";

export const CLEAR_OUTPUT_REQUEST = "CLEAR_OUTPUT_REQUEST";
export const FETCH_OUTPUT_REQUEST = "FETCH_OUTPUT_REQUEST";
export const FETCH_OUTPUT_SUCCESS = "FETCH_OUTPUT_SUCCESS";

export const CLEAR_CREATE_EXECUTION = "CLEAR_CREATE_EXECUTION";
export const SET_CREATE_EXECUTION_METHOD = "SET_CREATE_EXECUTION_METHOD";
export const FETCH_CREATE_EXECUTION_METHOD_REQUEST = "FETCH_CREATE_EXECUTION_METHOD_REQUEST";
export const FETCH_CREATE_EXECUTION_METHOD_SUCCESS = "FETCH_CREATE_EXECUTION_METHOD_SUCCESS";

export const UPDATE_FILTER = "UPDATE_FILTER";
export const DELETE_FILTER = "DELETE_FILTER";

export const OPEN_FILTER_DIALOG = "OPEN_FILTER_DIALOG";
export const CLOSE_FILTER_DIALOG = "CLOSE_FILTER_DIALOG";

export const UPDATE_SELECTION = "UPDATE_SELECTION";


// TODO Add support for failed action.

export function clearExecutionList() {
    return {
        "type": CLEAR_EXECUTION_LIST
    };
}

export function fetchExecutionList() {
    return (dispatch) => {
        dispatch(fetchExecutionListRequest());
        const url = "/api/v1/resources/executions";
        fetchJsonAndDispatch(url, dispatch, fetchExecutionListSuccess)
    };
}

function fetchExecutionListRequest() {
    return {
        "type": FETCH_EXECUTION_LIST_REQUEST,
    };
}

function fetchExecutionListSuccess(data) {
    return {
        "type": FETCH_EXECUTION_LIST_SUCCESS,
        "data": data
    }
}

export function clearExecutionDetail() {
    return {
        "type": CLEAR_EXECUTION_DETAIL_LIST
    };
}

export function fetchExecutionDetail(id) {
    return (dispatch) => {
        dispatch(fetchExecutionDetailRequest());
        const url = "/api/v1/resources/executions/" + id;
        fetchJson(url).then((data) => {
            dispatch(fetchExecutionDetailSuccess(data));
        });
    };
}

function fetchExecutionDetailRequest() {
    return {
        "type": FETCH_EXECUTION_DETAIL_REQUEST,
    };
}

function fetchExecutionDetailSuccess(data) {
    return {
        "type": FETCH_EXECUTION_DETAIL_SUCCESS,
        "data": data
    }
}

export function clearOutputs() {
    return {
        "type": CLEAR_OUTPUT_REQUEST
    }
}

export function fetchOutput(executionId, methodId, fileName) {
    return (dispatch) => {
        dispatch(fetchOutputRequest(executionId, methodId, fileName));
        const url = "/api/v1/resources/executions/" + executionId + "/" +
            methodId + "/output/" + fileName;
        fetchJson(url).then((data) => {
            dispatch(fetchOutputSuccess(executionId, methodId, fileName, data));
        });
    };
}

function fetchOutputRequest(executionId, methodId, fileName) {
    return {
        "type": FETCH_OUTPUT_REQUEST,
        "executionId": executionId,
        "methodId": methodId,
        "fileName" : fileName
    };
}

function fetchOutputSuccess(executionId, methodId, fileName, data) {
    return {
        "type": FETCH_OUTPUT_SUCCESS,
        "executionId": executionId,
        "methodId": methodId,
        "fileName" : fileName,
        "data": data
    }
}

export function clearCreateExecution() {
    return {
        "type": CLEAR_CREATE_EXECUTION
    }
}

export function setMethodsForCreateExecution(methods) {
    return {
        "type": SET_CREATE_EXECUTION_METHOD,
        "methods": methods
    }
}

export function fetchMethod(methodId) {
    // TODO Check if the method is not already loaded.
    return (dispatch) => {
        dispatch(fetchMethodRequest(methodId));
        const url = "/api/v1/resources/methods/" + methodId;
        fetchJson(url).then((data) => {
            dispatch(fetchMethodSuccess(methodId, data));
        });
    };
}

function fetchMethodRequest(methodId) {
    return {
        "type": FETCH_CREATE_EXECUTION_METHOD_REQUEST,
        "methodId": methodId
    };
}

function fetchMethodSuccess(methodId, data) {
    return {
        "type": FETCH_CREATE_EXECUTION_METHOD_SUCCESS,
        "methodId": methodId,
        "data": data
    }
}

export function updateFilter(index, filter) {
    return {
        "type": UPDATE_FILTER,
        "index": index,
        "data": filter
    }
}

export function deleteFilter(index) {
    return {
        "type": DELETE_FILTER,
        "index": index
    }
}

export function openFilterDialog(index) {
    return {
        "type": OPEN_FILTER_DIALOG,
        "index": index
    }
}

export function closeFilterDialog() {
    return {
        "type": CLOSE_FILTER_DIALOG
    }
}

export function updateSelection(selection) {
    return {
        "type": UPDATE_SELECTION,
        "data": {"id": selection}
    }
}
