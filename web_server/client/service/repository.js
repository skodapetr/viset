import {STATUS_INITIAL, STATUS_FETCHED} from "./data-access";

export function dataSelector(entry) {
    if (entry === undefined) {
        return undefined;
    } else {
        return entry.data;
    }
}

export function isLoadingSelector(entry) {
    return entry === undefined || entry.status !== STATUS_FETCHED;
}

export function shouldNotBeFetchedSelector(entry) {
    return entry !== undefined && entry.status !== STATUS_INITIAL;
}
