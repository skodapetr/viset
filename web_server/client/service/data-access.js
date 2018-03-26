export const STATUS_INITIAL = "initial";

export const STATUS_FETCHING = "fetching";

export const STATUS_FETCHED = "fetched";

// TODO Fetch API have options for: cache, headers (Accept), redirect

export function fetchJson(url) {
    return fetch(url).then(json);
}

export function fetchJsonAndDispatch(url, dispatch, onSuccess) {
    fetch(url).then(json).then((data) => dispatch(onSuccess(data)));
}

function json(response) {
    return response.json();
}

export function postJson(url, body) {
    return fetch(url, {
        "body": JSON.stringify(body),
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
    }).then(json);
}

// TODO We can check response code: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
