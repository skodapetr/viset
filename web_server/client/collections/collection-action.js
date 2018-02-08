import {fetchJsonAndDispatch} from "./../service/data-access";

export const FETCH_COLLECTION_LIST_REQUEST = "FETCH_COLLECTION_LIST_REQUEST";
export const FETCH_COLLECTION_LIST_SUCCESS = "FETCH_COLLECTION_LIST_SUCCESS";

export const FETCH_COLLECTION_DETAIL_REQUEST = "FETCH_COLLECTION_DETAIL_REQUEST";
export const FETCH_COLLECTION_DETAIL_SUCCESS = "FETCH_COLLECTION_DETAIL_SUCCESS";

export const DELETE_COLLECTION_DETAIL = "DELETE_COLLECTION_DETAIL";

export function fetchCollections() {
    return (dispatch) => {
        dispatch(fetchCollectionsRequest());
        const url = "/api/v1/resources/collections";
        fetchJsonAndDispatch(url, dispatch, fetchCollectionsSuccess)
    };
}

function fetchCollectionsRequest() {
    return {
        "type": FETCH_COLLECTION_LIST_REQUEST
    };
}

function fetchCollectionsSuccess(data) {
    return {
        "type": FETCH_COLLECTION_LIST_SUCCESS,
        "data": data
    };
}

export function fetchCollectionDetail(id) {
    return (dispatch) => {
        dispatch(fetchCollectionDetailRequest(id));
        const url = "/api/v1/resources/collections/" + id;
        fetchJsonAndDispatch(url, dispatch, fetchCollectionDetailSuccess);
    };
}

function fetchCollectionDetailRequest(id) {
    return {
        "type": FETCH_COLLECTION_DETAIL_REQUEST,
        "id": id
    };
}

function fetchCollectionDetailSuccess(data) {
    return {
        "type": FETCH_COLLECTION_DETAIL_SUCCESS,
        "id": data["id"],
        "data": data
    }
}

export function deleteCollectionDetail(id) {
    return {
        "type": DELETE_COLLECTION_DETAIL,
        "id": id
    }
}