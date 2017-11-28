"use strict";

const fs = require("fs");
const io = require("./io-utils");
const methods = require("./methods-service");

class IndexRecord {
    constructor(execution, path) {
        this.id = execution["id"];
        this.data = execution;
        this.path = path;
    }
}

class ExecutionReference {
    constructor(id, path) {
        this.id = id;
        this.path = path;
    }
}

const index = buildIndex();
const publicList = createPublicList(index);

module.exports = {
    "list": () => publicList,
    "get": getExecutionData,
    "create": createExecution,
    "onExecutionWillStart": onExecutionWillStart,
    "onExecutionFinished": onExecutionFinished,
    "getMethodDirectory": getMethodDirectory,
    "getMethodWorkflowPath": (executionId, methodId) => {
        return getMethodDirectory(executionId, methodId) +
            "/workflow.json";
    },
    "getOutputResourcePath": (executionId, methodId, fileName) => {
        return getMethodDirectory(executionId, methodId) +
            "/output/" + fileName;
    },
    "initializeExecution": initializeExecution
};

function buildIndex() {
    const index = {};
    const executionDirectory = getExecutionsDirectory();
    fs.readdirSync(executionDirectory).forEach(file => {
        const path = executionDirectory + file;
        try {
            // TODO Extract path definition to function.
            const execution = io.fileToJson(path + "/frontend.json");
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
    return getExecutionsDirectory() + executionId + "/methods/" + methodId;
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

function createExecution() {
    const id = createUniqueId();
    const path = getExecutionsDirectory() + id;
    return io.mkdirAsynch(path)
    .then(() => io.mkdirAsynch(path + "/input"))
    .then(() => io.mkdirAsynch(path + "/methods"))
    .then(() => new ExecutionReference(id, path));
}

function createUniqueId() {
    let id = createRandomId();
    while (index[id] !== undefined) {
        id = createRandomId();
    }
    return id;
}

function createRandomId() {
    return "xxxx-xxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function onExecutionWillStart(executionId, methodId) {
    console.log("onExecutionWillStart", executionId, methodId);
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
    return io.jsonToFile(execution, indexRecord["path"] + "/frontend.json");
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
    console.log("onExecutionFinished", executionId, methodId, "with", status);
    return updateExecutionMethod(executionId, methodId, (method) => {
        method["status"] = status;
        method["finish"] = getCurrentTimeAsXsdTime();
    });
}

function initializeExecution(reference, methodIds) {
    const executionMethods = {};
    return methodIds.reduce((prev, methodId) => {
        const method = methods.get(methodId);
        executionMethods[method["metadata"]["id"]] = createMethodObject(method);
        return prev.then(() => addWorkflowFile(reference["path"], method));
    }, Promise.resolve()).then(() => {
        const indexRecord = new IndexRecord({
            "id": reference["id"],
            "methods": executionMethods
        }, reference["path"]);
        return addToIndex(indexRecord);
    });
}

function createMethodObject(method) {
    return {
        "id": method["metadata"]["id"],
        "label": method["metadata"]["label"],
        // TODO Introduce constants for STATUS.
        "status": "queued"
    }
}

function addWorkflowFile(executionDirectory, method) {
    const directory = executionDirectory + "/methods/" + method["metadata"]["id"];
    return io.mkdirAsynch(directory)
    .then(() => io.mkdirAsynch(directory + "/working"))
    .then(() => io.mkdirAsynch(directory + "/output"))
    .then(() => io.jsonToFile(method, directory + "/workflow.json"));
}

function addToIndex(indexRecord) {
    index[indexRecord["id"]] = indexRecord;
    publicList.push(createPublicIndexRecord(indexRecord["data"]));
    return writeFrontendFile(indexRecord);
}

function writeFrontendFile(indexRecord) {
    // TODO Move file names to constants.
    const frontendFilePath = indexRecord["path"] + "/frontend.json";
    return io.jsonToFile(indexRecord["data"], frontendFilePath);
}
