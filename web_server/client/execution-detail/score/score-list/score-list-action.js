export const SET_PAGE = "SET_PAGE";
export const DESTROY_METHODS = "DESTROY_METHODS";
export const INITIALIZE_METHOD = "INITIALIZE_METHOD";

export function initializeMethod(method) {
    return {
        "type": INITIALIZE_METHOD,
        "method": method
    };
}

export function setMethodPage(method, page) {
    return {
        "type": SET_PAGE,
        "page": page,
        "method": method
    };
}

export function destroyMethods() {
    return {
        "type": DESTROY_METHODS
    };
}
