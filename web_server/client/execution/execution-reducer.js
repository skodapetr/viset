import {
    FETCH_EXECUTION_LIST_REQUEST,
    FETCH_EXECUTION_LIST_SUCCESS,
    FETCH_EXECUTION_DETAIL_REQUEST,
    FETCH_EXECUTION_DETAIL_SUCCESS,
    CLEAR_EXECUTION_DETAIL,
    FETCH_METHOD_SUMMARY_REQUEST,
    FETCH_METHOD_SUMMARY_SUCCESS,
    FETCH_OUTPUT_REQUEST,
    FETCH_OUTPUT_SUCCESS
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
    "details": {},
    // TODO Add support for multiple executions for summaries, outputs
    "summaries": {},
    "outputs": {}
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
            // TODO Clear execution detail and related data.
            return state;
        case FETCH_METHOD_SUMMARY_REQUEST:
            return onFetchSummaryRequest(state, action);
        case FETCH_METHOD_SUMMARY_SUCCESS:
            return onFetchSummarySuccess(state, action);
        case FETCH_OUTPUT_REQUEST:
            return onFetchOutputRequest(state, action);
        case FETCH_OUTPUT_SUCCESS:
            return onFetchOutputSuccess(state, action);
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
            ...state.details,
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
            ...state.details,
            [action.id]: {
                "status": STATUS_FETCHED,
                "data": action.data
            }
        }
    };
}

function onFetchSummaryRequest(state, action) {
    const id = action.method;
    return {
        ...state,
        "summaries": {
            ...state.summaries,
            [id]: {
                "data": undefined,
                "status": STATUS_FETCHING
            }
        }
    }
}

function onFetchSummarySuccess(state, action) {
    const id = action.method;
    return {
        ...state,
        "summaries": {
            ...state.summaries,
            [id]: {
                "data": action.data,
                "status": STATUS_FETCHED
            }
        }
    }
}

function onFetchOutputRequest(state, action) {
    const id = action.method + "_" + action.run + "_" + action.file;
    return {
        ...state,
        "outputs": {
            ...state.outputs,
            [id]: {
                "data": undefined,
                "status": STATUS_FETCHING
            }
        }
    }
}

function onFetchOutputSuccess(state, action) {
    const id = action.method + "_" + action.run + "_" + action.file;
    return {
        ...state,
        "outputs": {
            ...state.outputs,
            [id]: {
                "data": action.data,
                "status": STATUS_FETCHED
            }
        }
    }
}

const executionSelector = state => state[REDUCER_NAME];

export function executionListSelector(state) {
    return executionSelector(state).list;
}

export function executionDetailSelector(state, id) {
    return executionSelector(state).details[id];
}

export function executionMethodSummarySelector(state, id) {
    return executionSelector(state).summaries[id];
}

export function outputSelector(state, executionId, methodId, runId, outputName) {
    const id = methodId + "_" + runId + "_" + outputName;
    return executionSelector(state).outputs[id];
}
