import {
    INITIALIZE_METHOD,
    SET_PAGE,
    DESTROY_METHODS
} from "./score-item-list-action";

const REDUCER_NAME = "score-item-list";

const INITIAL_STATE = {
    "selection": []
};

const REDUCER = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INITIALIZE_METHOD:
            return onInitialize(state, action);
        case SET_PAGE:
            return onSetPage(state, action);
        case DESTROY_METHODS:
            return onDestroy();
        default:
            return state;
    }
};

export default {
    "name": REDUCER_NAME,
    "reducer": REDUCER
};

function onInitialize(state, action) {
    if (state[action.method] !== undefined) {
        return state;
    }
    return {
        ...state,
        [action.method]: {
            "page": 0
        }
    }
}

function onSetPage(state, action) {
    return {
        ...state,
        [action.method]: {
            "page": action.page
        }
    }
}

function onDestroy() {
    return {}
}

const scoreItemListSelector = state => state[REDUCER_NAME];

export function initializedSelector(state, method) {
    const data = scoreItemListSelector(state)[method];
    return data !== undefined;
}

export function pageSelector(state, method) {
    const data = scoreItemListSelector(state)[method];
    if (data === undefined) {
        return 0;
    } else {
        return data.page;
    }
}