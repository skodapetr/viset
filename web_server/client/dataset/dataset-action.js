import {fetchJsonAndDispatch} from "./../service/data-access";

export const FETCH_DATASET_LIST_REQUEST = "FETCH_DATASET_LIST_REQUEST";
export const FETCH_DATASET_LIST_SUCCESS = "FETCH_DATASET_LIST_SUCCESS";

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
