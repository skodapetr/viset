import {fetchMethod} from "./../../method/method-action";

export const EXECUTION_CREATE_INITIALIZE = "EXECUTION_CREATE_INITIALIZE";
export const TOGGLE_METHOD_SELECTION = "TOGGLE_METHOD_SELECTION";
export const EXECUTION_CREATE_DESTROY = "EXECUTION_CREATE_DESTROY";

export function initialize() {
    return {
        "type" : EXECUTION_CREATE_INITIALIZE
    }
}

export function toggleMethodSelection(methodId) {
    return {
        "type": TOGGLE_METHOD_SELECTION,
        "methodId": methodId
    }
}

export function fetchSelectedMethods(methods) {
    return (dispatch) => {
        fetchMethods(dispatch, methods);
    }
}

function fetchMethods(dispatch, methodsIds) {
    methodsIds.forEach((key) => dispatch(fetchMethod(key)));
}

export function destroy() {
    return {
        "type" : EXECUTION_CREATE_DESTROY
    }
}