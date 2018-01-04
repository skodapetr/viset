import {TOGGLE_SELECTION, CLEAR_SELECTION} from "./execution-detail-action";

const REDUCER_NAME = "execution-detail";

const INITIAL_STATE = {
    "selection": []
};

const REDUCER = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TOGGLE_SELECTION:
            return onToggleSelection(state, action);
        case CLEAR_SELECTION:
            return onClearSelection(state);
        default:
            return state;
    }
};

export default {
    "name": REDUCER_NAME,
    "reducer": REDUCER
};

function onToggleSelection(state, action) {
    const selection = [];
    let found = false;
    for (let index in state.selection) {
        const item = state.selection[index];
        if (item == action.data.id) {
            found = true;
            continue;
        }
        selection.push(item);
    }
    if (!found) {
        selection.push(action.data.id);
    }
    return {
        ...state,
        "selection": selection
    }
}

function onClearSelection(state) {
    return {
        ...state,
        "selection": []
    }
}

const dashboardSelector = state => state[REDUCER_NAME];

export function sharedSelectionSelector(state) {
    return dashboardSelector(state).selection;
}