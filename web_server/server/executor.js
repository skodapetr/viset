"use strict";

const exec = require("child_process").exec;
const executions = require("./execution-service.js");

const THREAD_COUNT = 1;

const executor = {
    "running": []
};

(function initialize() {
    scheduleNextCheck();
})();

function scheduleNextCheck() {
    // TODO Move to a configuration.
    setTimeout(executorCheck, 5 * 1000)
}

function executorCheck() {
    const list = executions.list();
    for (let index in list) {
        const record = list[index];
        checkExecutionForQueuedMethods(record);
    }
    scheduleNextCheck();
}

function checkExecutionForQueuedMethods(execution) {
    for (let index in execution["methods"]) {
        const method = execution["methods"][index];
        if (method["status"] === "queued") {
            onQueuedMethod(execution["id"], method["id"]);
        }
    }
}

function onQueuedMethod(executionId, methodId) {
    console.log("onQueuedMethod", executionId, methodId);
    // TODO Load limit from a configuration file.
    const runningId = getRunningIdForExecutionAndMethod(executionId, methodId);
    if (executor["running"].length < THREAD_COUNT &&
        executor["running"][runningId] === undefined) {
        startExecution(executionId, methodId);
    }
}

function getRunningIdForExecutionAndMethod(executionId, methodId) {
    return executionId + "/" + methodId;
}

function startExecution(executionId, methodId) {
    const path = executions.getMethodDirectory(executionId, methodId);
    const command = "python executor.py " +
        "--plugins ./../plugins " +
        "--workflow " + path + "/workflow.json " +
        "--input ./../../input " +
        "--working " + path +
        " > " + path + "/stdout.log" +
        " 2> " + path + "/stderr.log";
    // TODO Move path to configuration.
    const options = {
        "cwd": "./../executor/"
    };
    onExecutionWillStart(executionId, methodId);
    // TODO Consider, replace with:
    // var child = exec('...');
    // child.stdout.on('data', (data) => {});
    // child.stderr.on('data', (data) => {});
    // child.on('close', (code) => {});
    //
    exec(command, options, (error, stdout, stderr) => {
        onExecutionFinished(executionId, methodId, error);
    });
}

function onExecutionWillStart(executionId, methodId) {
    const runningId = getRunningIdForExecutionAndMethod(executionId, methodId);
    executor["running"].push(runningId);
    executions.onExecutionWillStart(executionId, methodId);
}

function onExecutionFinished(executionId, methodId, error) {
    if (error === null) {
        executions.onExecutionFinished(executionId, methodId, "finished");
    } else {
        console.log("execution:", executionId, "\nerror:\n", error);
        executions.onExecutionFinished(executionId, methodId, "failed");
    }
    //
    let running = executor["running"];
    const runningId = getRunningIdForExecutionAndMethod(executionId, methodId);
    running.splice(running.indexOf(runningId), 1);
    executor["running"] = running;
}
