import {
    FILTER_CREATE,
    FILTER_DESTROY,
    FILTER_CREATE_ITEM,
    FILTER_EDIT_ITEM,
    FILTER_DELETE_ITEM,
    FILTER_DIALOG_SAVE,
    FILTER_DIALOG_CANCEL
} from "./filter-action";
import {createEmptyFilterItem} from "./filter-api";

const REDUCER_NAME = "component-filter";

const INITIAL_STATE = {
    "dialog-open": false,
    "dialog-data": undefined,
    "data": {}
};

const REDUCER = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FILTER_CREATE:
            return onFilterCreate(state, action);
        case FILTER_DESTROY:
            return onFilterDestroy(state, action);
        case FILTER_CREATE_ITEM:
            return onCreateItem(state, action);
        case FILTER_EDIT_ITEM:
            return onEditItem(state, action);
        case FILTER_DELETE_ITEM:
            return onFilterDeleteItem(state, action);
        case FILTER_DIALOG_SAVE:
            return onDialogSave(state, action);
        case FILTER_DIALOG_CANCEL:
            return onDialogCancel(state);
        default:
            return state;
    }
};

export default {
    "name": REDUCER_NAME,
    "reducer": REDUCER
};

function onFilterCreate(state, action) {
    const filter = state["data"][action.filter];
    if (filter !== undefined) {
        return state;
    }
    return {
        ...state,
        "data": {
            ...state["data"],
            [action.filter]: []
        }
    }
}

function onFilterDestroy(state, action) {
    return {
        ...state,
        "data": {
            ...state["data"],
            [action.filter]: undefined
        }
    }
}

function onCreateItem(state, action) {
    const filters = state["data"][action.filter];
    return {
        ...state,
        "dialog-open": true,
        "dialog-data": {
            "filter": action.filter,
            "index": filters.length,
            "data": createEmptyFilterItem()
        }
    }
}

function onEditItem(state, action) {
    const filter = state["data"][action.filter][action.index];
    return {
        ...state,
        "dialog-open": true,
        "dialog-data": {
            "filter": action.filter,
            "index": action.index,
            "data": filter
        }
    }
}

function onFilterDeleteItem(state, action) {
    const sourceFilters = state["data"][action.filter];
    const filters = [];
    for (let index = 0; index < sourceFilters.length; ++index) {
        if (index == action.index) {
            continue;
        }
        filters.push(sourceFilters[index]);
    }
    return {
        ...state,
        "data": {
            ...state["data"],
            [action.filter]: filters
        }
    }
}

function onDialogSave(state, action) {
    const filter = state["dialog-data"].filter;
    const index = state["dialog-data"].index;
    const filters = [...state["data"][filter]];
    filters[index] = action.data;
    return {
        ...state,
        "dialog-open": false,
        "dialog-data": undefined,
        "data": {
            ...state["data"],
            [filter]: filters
        }

    }
}

function onDialogCancel(state) {
    return {
        ...state,
        "dialog-open": false,
        "dialog-data": undefined
    }
}

const filterSelector = state => state[REDUCER_NAME];

export function filterDataInitializedSelector(state, filterId) {
    const data = filterSelector(state)["data"][filterId];
    return data !== undefined;
}

export function filterDataSelector(state, filterId) {
    if (filterId === undefined) {
        return undefined;
    }
    const data = filterSelector(state)["data"][filterId];
    if (data === undefined) {
        return [];
    } else {
        return data;
    }
}

export function dialogOpenSelector(state) {
    return filterSelector(state)["dialog-open"];
}

export function dialogDataSelector(state) {
    return filterSelector(state)["dialog-data"];
}
