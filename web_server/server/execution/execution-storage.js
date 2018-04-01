"use strict";

const fs = require("fs");
const io = require("./../io-utils");

// Move to file that would be shared by execution and execution-factory ?
class IndexRecord {
    constructor(execution, path) {
        this.id = execution["id"];
        this.data = execution;
        this.path = path;
    }
}

module.exports = {
    "initialize": initialize,
    "list": () => publicList,
    "detail": getExecutionData,
    "delete": deleteExecution,
    //
    "onNewExecution": onNewExecution,
    "onExecutionWillStart": onExecutionWillStart,
    "onExecutionFinished": onExecutionFinished,
    //
    "getBenchmarkPath": getBenchmarkPath,
    "getMethodSummaryPath": getMethodSummaryPath,
    "getMethodWorkflowPath": getMethodWorkflowPath,
    "getMethodErrorOutputPath": getMethodErrorOutputPath,
    "getMethodStandardOutputPath": getMethodStandardOutputPath,
    "getRunOutputPath": getRunOutputPath
};

let index;
let publicList;

function initialize() {
    index = buildIndex();
    publicList = createPublicList(index);
}

function buildIndex() {
    const index = {};
    const executionDirectory = getExecutionsDirectory();
    if (!fs.existsSync(executionDirectory)) {
        fs.mkdir(executionDirectory);
    }
    fs.readdirSync(executionDirectory).forEach(file => {
        const path = executionDirectory + file;
        try {
            // TODO Extract path definition to function.
            const execution = io.fileToJson(path + "/frontend-index.json");
            const record = new IndexRecord(execution, path);
            index[record.id] = record;
        } catch (exception) {
            console.warn("Invalid execution: ", path);
        }
    });
    return index;
}

function getExecutionsDirectory() {
    return "./../data/executions/";
}

function getMethodDirectory(executionId, methodId) {
    return getExecutionsDirectory() +
        executionId + "/methods/" + methodId + "/";
}

function createPublicList(index) {
    const output = [];
    for (let id in index) {
        const execution = getExecutionData(id);
        output.push(createPublicIndexRecord(execution));
    }
    return output;
}

function createPublicIndexRecord(execution) {
    const methods = execution["methods"];
    return {
        "id": execution["id"],
        "label": execution["label"],
        "type": execution["type"],
        "methods": Object.keys(methods).map((key) => {
            const value = methods[key];
            return {
                "id": key,
                "label": value["label"],
                "status": value["status"],
                "start": value["start"],
                "finish": value["finish"]
            };
        })
    };
}

function getExecutionData(id) {
    const method = index[id];
    if (method === undefined) {
        return undefined;
    }
    return method["data"];
}

function deleteExecution(id) {
    deleteFromIndex(id);
    deleteFromPublicList(id);
    const path = getExecutionsDirectory() + id;
    return io.deleteDirectory(path);
}

function deleteFromIndex(id) {
    delete index[id];
}

function deleteFromPublicList(id) {
    for (let index in publicList) {
        if (publicList[index]["id"] === id) {
            publicList.splice(index, 1);
            return;
        }
    }
}

function onNewExecution(indexRecord) {
    index[indexRecord["id"]] = indexRecord;
    publicList.push(createPublicIndexRecord(indexRecord["data"]));
}

function onExecutionWillStart(executionId, methodId) {
    console.log("onExecutionWillStart: ", executionId, methodId);
    return updateExecutionMethod(executionId, methodId, (method) => {
        method["status"] = "running";
        method["start"] = getCurrentTimeAsXsdTime();
    });
}

function updateExecutionMethod(executionId, methodId, transformer) {
    const indexRecord = index[executionId];
    const execution = indexRecord["data"];
    const method = execution["methods"][methodId];
    transformer(method);
    updatePublicList(execution);
    return io.jsonToFile(execution,
        indexRecord["path"] + "/frontend-index.json");
}

function getCurrentTimeAsXsdTime() {
    // TODO Add time zone.
    const date = new Date();
    const xsdDate = date.toISOString();
    return xsdDate.substr(0, xsdDate.length - 1);
}

function updatePublicList(execution) {
    for (let index in publicList) {
        if (publicList[index]["id"] === execution["id"]) {
            publicList[index] = createPublicIndexRecord(execution);
            return;
        }
    }
}

function onExecutionFinished(executionId, methodId, status) {
    console.log("onExecutionFinished: ", executionId, methodId, "with", status);
    return updateExecutionMethod(executionId, methodId, (method) => {
        method["status"] = status;
        method["finish"] = getCurrentTimeAsXsdTime();
    });
}

function getBenchmarkPath(executionId) {
    return getExecutionsDirectory() + executionId + "/benchmark.json";
}

function getMethodSummaryPath(executionId, methodId) {
    return getMethodDirectory(executionId, methodId) + "summary.json";
}

function getMethodWorkflowPath(executionId, methodId) {
    return getMethodDirectory(executionId, methodId) + "workflow.json";
}

function getMethodErrorOutputPath(executionId, methodId) {
    return getMethodDirectory(executionId, methodId) + "stderr.log";
}

function getMethodStandardOutputPath(executionId, methodId) {
    return getMethodDirectory(executionId, methodId) + "stdout.log";
}

function getRunDirectory(executionId, methodId, runId) {
    return getMethodDirectory(executionId, methodId) + runId + "/";
}

function getRunOutputPath(executionId, methodId, runId, fileName) {
    return getRunDirectory(executionId, methodId, runId) +
        "/output/" + fileName;
}

