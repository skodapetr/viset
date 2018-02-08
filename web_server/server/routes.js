"use strict";

const express = require("express");
const multiparty = require("multiparty");
const datasets = require("./dataset-service");
const executions = require("./execution-service");
const methods = require("./methods-service");
const io = require("./io-utils");

(function initialize() {
    const router = express.Router();
    addExecutionAndCollectionsRoutes(router);
    addMethodsRoutes(router);
    addExecutionRoutes(router);
    module.exports = router;
})();

// TODO Handle promise failures.

function addExecutionAndCollectionsRoutes(router) {

    router.get("/datasets", function (req, res) {
        res.status(200).json(datasets.datasetIndex());
    });

    router.get("/collections", function (req, res) {
        res.status(200).json(datasets.collectionIndex());
    });

    router.get("/collections/:id", function (req, res) {
        res.status(200).json(datasets.collection(req.params.id));
    });

}

function addMethodsRoutes(router) {

    router.get("/methods", function (req, res) {
        res.status(200).json(methods.list());
    });

    router.get("/methods/:id", function (req, res) {
        res.status(200).json(methods.get(req.params.id));
    });

}

function addExecutionRoutes(router) {

    router.get("/executions", function (req, res) {
        res.status(200).json(executions.list());
    });

    router.post("/executions", function (req, res) {
        handleExecutionPost(req, res);
    });

    router.get("/executions/:id", function (req, res) {
        res.status(200).json(executions.get(req.params.id));
    });

    router.delete("/executions/:id", function (req, res) {
        executions.delete(req.params.id)
        .then(() => res.status(200).json({}))
        .catch(error => res.status(500).json({"error": error}));
    });

    router.get("/executions/:id/:method", function (req, res) {
        const params = req.params;
        const path = executions.getMethodWorkflowPath(
            params.id, params.method);
        io.fileToResponse(path, res);
    });

    router.get("/executions/:id/:method/output/:fileName", function (req, res) {
        const params = req.params;
        const path = executions.getOutputResourcePath(
            params.id, params.method, params.fileName);
        io.fileToResponse(path, res);
    });

}

function handleExecutionPost(req, res) {
    executions.create().then((execution) => {
        return parserRequestToExecution(req, execution)
        .then(() => res.status(200).json({"id": execution["id"]}));
    })
    .catch((error) => {// TODO Delete execution.
        console.log("error: ", error);
        res.status(500).json({"error": error.toString()})
    });
}

function parserRequestToExecution(req, execution) {
    return new Promise((fulfill, reject) => {
        const form = new multiparty.Form();
        let methodsString = "";
        let executionInfoString = "";
        form.on("part", (part) => {
            if (part["name"] === "methods") {
                part.on("data", function (chunk) {
                    methodsString += chunk;
                });
            } else if (part["name"] === "execution") {
                part.on("data", function (chunk) {
                    executionInfoString += chunk;
                });
            } else if (part["name"] === "input" &&
                part["filename"] !== undefined) {
                // TODO Check file path for ".."
                const path = execution["path"] + "/input/" + part["filename"];
                io.streamToFile(part, path);
            } else {
                part.resume();
            }
        });
        form.on("close", () => {
            const methodIds = JSON.parse(methodsString);
            const executionInfo = JSON.parse(executionInfoString);
            executions.initializeExecution(execution, methodIds, executionInfo)
            .then(fulfill)
            .catch(reject);
        });
        form.parse(req);
    });
}
