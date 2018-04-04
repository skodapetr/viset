"use strict";

module.exports = {
    "connect": connect,
    "start": start
};

// TODO Load from property files.
const THREAD_COUNT = 1;
const CHECK_PERIOD = 5 * 1000;

let executionStorage;
// TODO Detect and sanitize hanging execution.
let runningTasks = [];
let executor = undefined;

function connect(newExecutor, newStorage) {
    executor = newExecutor;
    executionStorage = newStorage;
}

function start() {
    scheduleNextExecution();
}

function scheduleNextExecution() {
    setTimeout(() => {
        checkExecutions();
        scheduleNextExecution();
    }, CHECK_PERIOD);
}

function checkExecutions() {
    const list = executionStorage.list();
    for (let index in list) {
        const record = list[index];
        checkExecutionForQueuedMethods(record);
    }
}

function checkExecutionForQueuedMethods(execution) {
    for (let index in execution["methods"]) {
        const method = execution["methods"][index];
        // TODO Export status as a constant.
        if (method["status"] === "queued") {
            onQueuedMethod(execution, method);
        }
    }
}

function onQueuedMethod(execution, method) {
    const id = methodExecutionId(execution, method);
    if (runningTasks.length < THREAD_COUNT && runningTasks[id] === undefined) {
        executionStorage.onExecutionWillStart(execution.id, method.id);
        startExecution(execution, method).then(() => {
            onExecutionFinished(execution, method);
        }).catch((error) => {
            onExecutionFailed(execution, method, error);
        })
    }
}

function methodExecutionId(execution, method) {
    return execution.id + "/" + method.id;
}

function startExecution(execution, method) {
    const id = methodExecutionId(execution, method);
    runningTasks.push(id);
    const directory = executionDirectory(execution, method);
    if (execution.type === "benchmark") {
        return executor.startBenchmarkExecution(id, directory);
    } else {
        return executor.startExecution(id, directory);
    }
}

function executionDirectory(execution, method) {
    return "./data/executions/" + execution.id + "/methods/" + method.id;
}

function onExecutionFinished(execution, method) {
    executionStorage.onExecutionFinished(execution.id, method.id, "finished");
    removeFromRunningList(execution, method);
}

function removeFromRunningList(execution, method) {
    const id = methodExecutionId(execution, method);
    const updatedRunningList = runningTasks;
    updatedRunningList.splice(updatedRunningList.indexOf(id), 1);
    runningTasks = updatedRunningList;
}

function onExecutionFailed(execution, method, error) {
    console.log("execution:", execution.id, "\nerror:\n", error);
    executionStorage.onExecutionFinished(execution.id, method.id, "failed");
    removeFromRunningList(execution, method);
}
