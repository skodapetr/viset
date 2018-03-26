import {fetchJsonAndDispatch, postJson} from "./../service/data-access";

export const FETCH_DATASET_LIST_REQUEST = "FETCH_DATASET_LIST_REQUEST";
export const FETCH_DATASET_LIST_SUCCESS = "FETCH_DATASET_LIST_SUCCESS";

export const FETCH_DATASET_DETAIL_REQUEST = "FETCH_DATASET_DETAIL_REQUEST";
export const FETCH_DATASET_DETAIL_SUCCESS = "FETCH_DATASET_DETAIL_SUCCESS";

export const DOWNLOAD_REQUEST = "DOWNLOAD_REQUEST";

export function fetchDatasets() {
    return (dispatch) => {
        dispatch(fetchDatasetsRequest());
        const url = "/api/v1/resources/datasets";
        fetchJsonAndDispatch(url, dispatch, fetchDatasetsSuccess)
    };
}

function fetchDatasetsRequest() {
    return {
        "type": FETCH_DATASET_LIST_REQUEST
    };
}

function fetchDatasetsSuccess(data) {
    return {
        "type": FETCH_DATASET_LIST_SUCCESS,
        "data": data
    };
}

export function fetchDatasetDetail(id) {
    return (dispatch) => {
        dispatch(fetchDatasetDetailRequest(id));
        const url = "/api/v1/resources/datasets/" + id;
        fetchJsonAndDispatch(url, dispatch, fetchDatasetDetailSuccess);
    };
}

function fetchDatasetDetailRequest(id) {
    return {
        "type": FETCH_DATASET_DETAIL_REQUEST,
        "id": id
    };
}

function fetchDatasetDetailSuccess(data) {
    return {
        "type": FETCH_DATASET_DETAIL_SUCCESS,
        "id": data["id"],
        "data": data
    }
}

export function requestDownload(id) {
    const taskDefinition = {
        "type": "dataset_download",
        "dataset": id
    };
    postJson("/api/v1/resources/services", taskDefinition);
    //
    return {
        "type": DOWNLOAD_REQUEST,
        "id": id
    }
}
