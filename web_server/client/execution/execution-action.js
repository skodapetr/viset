import {fetchJsonAndDispatch} from "./../service/data-access";
import {shouldNotBeFetchedSelector} from "./../service/repository";

export const FETCH_EXECUTION_LIST_REQUEST = "FETCH_EXECUTION_LIST_REQUEST";
export const FETCH_EXECUTION_LIST_SUCCESS = "FETCH_EXECUTION_LIST_SUCCESS";

export const FETCH_METHOD_SUMMARY_REQUEST = "FETCH_METHOD_SUMMARY_REQUEST";
export const FETCH_METHOD_SUMMARY_SUCCESS = "FETCH_METHOD_SUMMARY_SUCCESS";

export const CLEAR_EXECUTION_DETAIL = "CLEAR_EXECUTION_DETAIL";

export const FETCH_EXECUTION_DETAIL_REQUEST = "FETCH_EXECUTION_DETAIL_REQUEST";
export const FETCH_EXECUTION_DETAIL_SUCCESS = "FETCH_EXECUTION_DETAIL_SUCCESS";

export const FETCH_OUTPUT_REQUEST = "FETCH_OUTPUT_REQUEST";
export const FETCH_OUTPUT_SUCCESS = "FETCH_OUTPUT_SUCCESS";

export function fetchExecutions() {
    return (dispatch) => {
        dispatch(fetchExecutionsRequest());
        const url = "/api/v1/resources/executions";
        fetchJsonAndDispatch(url, dispatch, fetchExecutionsSuccess);
    };
}

function fetchExecutionsRequest() {
    return {
        "type": FETCH_EXECUTION_LIST_REQUEST
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
        fetchJsonAndDispatch(url, dispatch, fetchExecutionSuccess);
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

export function fetchOutput(executionId, methodId, runId, fileName) {
    // TODO Add caching.
    return (dispatch, getState) => {

        // TODO This would require to depend on reducer.
        const id = methodId + "_" + runId + "_" + fileName;
        const entity = getState().execution.outputs[id];
        if (shouldNotBeFetchedSelector(entity)) {
            return;
        }

        dispatch(fetchOutputRequest(executionId, methodId, runId, fileName));
        const url = "/api/v1/resources/executions/" +
            executionId + "/methods/" + methodId + "/runs/" + runId +
            "/outputs/" + fileName;
        fetchJsonAndDispatch(url, dispatch, (data) =>
            fetchOutputSuccess(executionId, methodId, runId, fileName, data));
    };
}

function fetchOutputRequest(executionId, methodId, runId, fileName) {
    return {
        "type": FETCH_OUTPUT_REQUEST,
        "execution": executionId,
        "method": methodId,
        "run": runId,
        "file": fileName
    }
}

function fetchOutputSuccess(executionId, methodId, runId, fileName, data) {
    return {
        "type": FETCH_OUTPUT_SUCCESS,
        "execution": executionId,
        "method": methodId,
        "run": runId,
        "file": fileName,
        "data": data
    }
}

export function fetchExecutionMethodSummaries(execution) {
    const executionId = execution["id"];
    return (dispatch) => {
        // TODO Add support for caching.
        Object.keys(execution["methods"]).map(methodId => {
            dispatch(fetchExecutionMethodSummaryRequest(executionId, methodId));
            // TODO Move URL to API
            const url = "/api/v1/resources/executions/" +
                executionId + "/methods/" + methodId + "/summary";
            fetchJsonAndDispatch(url, dispatch, (data) =>
                fetchExecutionMethodSummarySuccess(executionId, methodId, data));
        });
    };
}

function fetchExecutionMethodSummaryRequest(executionId, methodId) {
    return {
        "type": FETCH_METHOD_SUMMARY_REQUEST,
        "execution": executionId,
        "method": methodId
    }
}

function fetchExecutionMethodSummarySuccess(executionId, methodId, data) {
    return {
        "type": FETCH_METHOD_SUMMARY_SUCCESS,
        "execution": executionId,
        "method": methodId,
        "data": data
    }
}

