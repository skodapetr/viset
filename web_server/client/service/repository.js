import {STATUS_INITIAL, STATUS_FETCHED} from "./data-access";

export function dataSelector(entry) {
    if (entry === undefined) {
        return undefined;
    } else {
        return entry.data;
    }
}

export function dataListSelector(entries) {
    if (entries === undefined) {
        return [];
    }
    return entries.map((item) => dataSelector(item));
}


export function isLoadingSelector(entry) {
    return entry === undefined || entry.status !== STATUS_FETCHED;
}

export function shouldNotBeFetchedSelector(entry) {
    return entry !== undefined && entry.status !== STATUS_INITIAL;
}

export function isLoadingListSelector(entries) {
    for (let index in entries) {
        if (isLoadingSelector(entries[index])) {
            return true;
        }
    }
    return false;
}