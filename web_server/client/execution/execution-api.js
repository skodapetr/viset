
export function isExecutionFinished(execution) {
    let result = true;
    Object.values(execution.methods).forEach((method) => {
        result &= method.status === "finished";
    });
    return result;
}

export function isExecutionFinishedOrFailed(execution) {
    let result = true;
    Object.values(execution.methods).forEach((method) => {
        result &= method.status === "finished" || method.status === "failed";
    });
    return result;
}

export function createExecutionSummary(execution) {
    let start = undefined;
    let finish = 0;
    let status = 128;
    Object.values(execution.methods).forEach((method) => {
        const methodStart = new Date(method.start);
        const methodFinish = new Date(method.finish);
        start = start === undefined ? methodStart :
            (methodStart < start ? methodStart : start);
        finish = methodFinish > finish ? methodStart : finish;
        status = Math.min(status, statusToNumber(method.status));
    });
    return {
        "start": start,
        "finish": finish,
        "status": numberToStatus(status)
    };
}

// Order represent priorities for grouping.

function statusToNumber(status) {
    switch (status) {
        case "running":
            return 0;
        case "queued":
            return 1;
        case "failed":
            return 2;
        case "finished":
            return 3;
    }
}

function numberToStatus(status) {
    switch (status) {
        case 0:
            return "running";
        case 1:
            return "queued";
        case 2:
            return "failed";
        case 3:
            return "finished";
    }
}

export function deleteExecution(id) {
    const url = "/api/v1/resources/executions/" + id;
    return fetch(url, {"method": "delete"});
}