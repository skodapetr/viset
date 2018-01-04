import {
    CLEAR_OUTPUTS,
    FETCH_OUTPUT_REQUEST,
    FETCH_OUTPUT_SUCCESS
} from "./output-action";
import {STATUS_FETCHING, STATUS_FETCHED} from "../service/data-access";

const REDUCER_NAME = "output";

const INITIAL_STATE = {};

const REDUCER = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CLEAR_OUTPUTS:
            return onClearOutputs();
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

function onClearOutputs() {
    return {};
}

function onFetchOutputRequest(state, action) {
    const id = action.id;
    return {
        ...state,
        [id]: {
            "data": undefined,
            "status": STATUS_FETCHING
        }
    }
}

function onFetchOutputSuccess(state, action) {
    const id = action.id;
    return {
        ...state,
        [id]: {
            "data": action.data,
            "status": STATUS_FETCHED
        }
    }
}

const outputSelector = state => state[REDUCER_NAME];

export function outputDetailSelector(state, reference) {
    const ref = reference.execution + reference.method + reference.output;
    return outputSelector(state)[ref];
}

export function outputsDetailSelector(state) {
    return outputSelector(state);
}
