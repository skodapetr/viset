export const FILTER_CREATE = "FILTER_CREATE";
export const FILTER_DESTROY = "FILTER_DESTROY";
export const FILTER_CREATE_ITEM = "FILTER_CREATE_ITEM";
export const FILTER_EDIT_ITEM = "FILTER_EDIT_ITEM";
export const FILTER_DELETE_ITEM = "FILTER_DELETE_ITEM";
export const FILTER_DIALOG_SAVE = "FILTER_DIALOG_SAVE";
export const FILTER_DIALOG_CANCEL = "FILTER_DIALOG_CANCEL";

export function createFilter(filterId) {
    return {
        "type": FILTER_CREATE,
        "filter": filterId
    };
}

export function destroyFilter(filterId) {
    return {
        "type": FILTER_DESTROY,
        "filter": filterId
    };
}

export function createFilterItem(filterId) {
    return {
        "type": FILTER_CREATE_ITEM,
        "filter": filterId
    };
}

export function deleteFilterItem(filterId, index) {
    return {
        "type": FILTER_DELETE_ITEM,
        "filter": filterId,
        "index": index
    };
}

export function editFilterItem(filterId, index) {
    return {
        "type": FILTER_EDIT_ITEM,
        "filter": filterId,
        "index": index
    };
}

export function cancelDialog() {
    return {
        "type": FILTER_DIALOG_CANCEL,
    };
}

export function saveDialog(filterItem) {
    return {
        "type": FILTER_DIALOG_SAVE,
        "data": filterItem
    };
}

