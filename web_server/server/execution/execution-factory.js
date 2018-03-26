"use strict";

const fs = require("fs");
const io = require("./../io-utils");


// TODO Export constants and file-names to extra module.

module.exports = {
    "connect":connect,
    "create": createExecution,
    "createReference": createExecutionReference,
    "initialize": initializeExecution,
    "setWorkingPath": setWorkingPath
};

let workingPath = "./../data/executions/";
let methods;

function connect(newMethods) {
    methods = newMethods;
}

function createExecution() {
    const id = createUniqueId();
    const path = getExecutionsDirectory(id);
    return io.mkdirAsynch(path)
    .then(() => io.mkdirAsynch(path + "/input"))
    .then(() => io.mkdirAsynch(path + "/methods"))
    .then(() => createExecutionReference(id, path));
}

function createUniqueId() {
    let id = createRandomId();
    while (fs.existsSync(getExecutionsDirectory(id))) {
        id = createRandomId();
    }
    return id;
}

function createRandomId() {
    const timePrefix = (new Date()).getTime();
    return timePrefix + "-xxxx-xxxx".replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

function getExecutionsDirectory(id) {
    return workingPath + id;
}

function createExecutionReference(id, path) {
    return {
        "id": id,
        "path": path
    };
}

function initializeExecution(reference, methods, options) {
    const usedMethods = {};
    const startingValue = writeBenchmarkData(reference, options);
    const methodsPath = reference["path"] + "/methods/";
    return methods.reduce((prev, method) => {
        usedMethods[method["metadata"]["id"]] = createMethodObject(method);
        return prev.then(() => initMethodDirectory(methodsPath, method));
    }, startingValue).then(() => {
        const indexRecord = createExecutionRecord(
            reference, usedMethods, options);
        return writeFrontendFile(indexRecord)
        .then(() => Promise.resolve(indexRecord));
    });
}

function writeBenchmarkData(reference, options) {
    if (options["benchmark"] === undefined) {
        return Promise.resolve();
    }
    const path = reference["path"] + "/benchmark.json";
    return io.jsonToFile({"benchmark" : options["benchmark"]}, path);
}

function createMethodObject(method) {
    return {
        "id": method["metadata"]["id"],
        "label": method["metadata"]["label"],
        // TODO Introduce constants for STATUS.
        "status": "queued"
    }
}

function initMethodDirectory(directory, method) {
    const methodDir = directory + "/" + method["metadata"]["id"];
    return io.mkdirAsynch(methodDir)
    .then(() => io.jsonToFile(method, methodDir + "/workflow.json"));
}

function createExecutionRecord(reference, methods, options) {
    return {
        "id": reference["id"],
        "path": reference["path"]
    };
}

function createFrontendFileContent(reference, methods, options) {
    return {
        "id": reference["id"],
        "label": options["label"],
        "description": options["description"],
        "type": options["type"],
        "methods": methods
    };
}

function writeFrontendFile(indexRecord) {
    const frontendFilePath = indexRecord["path"] + "/frontend-index.json";
    return io.jsonToFile(indexRecord["data"], frontendFilePath);
}

function setWorkingPath(newWorkingPath) {
    workingPath = newWorkingPath;
}
