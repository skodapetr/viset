export const STATUS_INITIAL = "initial";

export const STATUS_FETCHING = "fetching";

export const STATUS_FETCHED = "fetched";

export const STATUS_FAILED = "failed";

export const fetchJson = (url) => {
    return fetch(url).then(json);
};

// TODO Add error handling.
export const fetchJsonAndDispatch = (url, dispatch, onSuccess, onFailure) => {
    fetch(url).then(json).then((data) => dispatch(onSuccess(data)));
};

function json(response) {
    return response.json();
}

// TODO We can check response code: https://developers.google.com/web/updates/2015/03/introduction-to-fetch