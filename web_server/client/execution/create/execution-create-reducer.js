import {
    EXECUTION_CREATE_INITIALIZE,
    TOGGLE_METHOD_SELECTION,
    EXECUTION_CREATE_DESTROY
} from "./execution-create-action";

const REDUCER_NAME = "execution-create";

const INITIAL_STATE = {};

const REDUCER = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case EXECUTION_CREATE_INITIALIZE:
            return onInitialize();
        case TOGGLE_METHOD_SELECTION:
             return onToggleMethodSelection(state, action);
        case EXECUTION_CREATE_DESTROY:
            return {};
        default:
            return state;
    }
};

export default {
    "name": REDUCER_NAME,
    "reducer": REDUCER
};

function onInitialize() {
    return {
        "selectedMethods": {}
    }
}

function onToggleMethodSelection(state, action) {
    const id = action.methodId;
    const selectedMethods = state.selectedMethods;
    const value = selectedMethods[id] === undefined ? true : undefined;
    return {
        ...state,
        "selectedMethods": {
            ...selectedMethods,
            [id]: value
        }
    }
}

const stateSelector = state => state[REDUCER_NAME];

export function selectedMethodsSelector(state) {
    const result = stateSelector(state).selectedMethods;
    if (result === undefined) {
        return {};
    } else {
        return result;
    }
}