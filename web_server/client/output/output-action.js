import {fetchJson} from "./../service/data-access";
import {shouldNotBeFetchedSelector} from "./../service/repository";

export const CLEAR_OUTPUTS = "CLEAR_OUTPUTS";
export const FETCH_OUTPUT_REQUEST = "FETCH_OUTPUT_REQUEST";
export const FETCH_OUTPUT_SUCCESS = "FETCH_OUTPUT_SUCCESS";

// TODO Add parameter for execution identification.
export function clearOutputs() {
    return {
        "type": CLEAR_OUTPUTS
    };
}

export function fetchOutput(reference) {
    const ref = reference.execution + reference.method + reference.output;
    return (dispatch, getStatus) => {
        const entity = getStatus().output[ref];
        if (shouldNotBeFetchedSelector(entity)) {
            return;
        }
        dispatch(fetchOutputRequest(ref));
        const url = "/api/v1/resources/executions/" +
            reference.execution + "/" +
            reference.method + "/output/" +
            reference.output;
        fetchJson(url).then((data) => dispatch(fetchOutputSuccess(data, ref)));
    };
}

function fetchOutputRequest(id) {
    return {
        "type": FETCH_OUTPUT_REQUEST,
        "id": id
    };
}

function fetchOutputSuccess(data, id) {
    return {
        "type": FETCH_OUTPUT_SUCCESS,
        "data": data,
        "id": id
    }
}