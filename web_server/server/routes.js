"use strict";

const express = require("express");
const multiparty = require("multiparty");
const datasets = require("./dataset");
const executions = require("./execution");
const collection = require("./collection");
const methods = require("./method");
const io = require("./io-utils");

(function initialize() {
    const router = express.Router();
    addServiceRoutes(router);
    addDatasetRoutes(router);
    addCollectionsRoutes(router);
    addMethodsRoutes(router);
    addExecutionRoutes(router);
    module.exports = router;
})();

// TODO Handle promise failures.

function addServiceRoutes(router) {

    router.post("/services", (req, res) => {
        // TODO Add error handling.
        // TODO Parse event !!
        const response = datasets.download(req.body["dataset"]);
        res.status(200).json(response);
    });

    // TODO Add service list and detail.

}

function addDatasetRoutes(router) {

    router.get("/datasets", (req, res) => {
        res.status(200).json(datasets.list());
    });

    router.get("/datasets/:dataset", (req, res) => {
        res.status(200).json(datasets.detail(req.params.dataset));
    });

}

function addCollectionsRoutes(router) {

    router.get("/collections", (req, res) => {
        res.status(200).json(collection.list());
    });

    router.get("/collections/:collection", (req, res) => {
        res.status(200).json(collection.detail(req.params.collection));
    });

}

function addMethodsRoutes(router) {

    router.get("/methods", (req, res) => {
        res.status(200).json(methods.list());
    });

    router.get("/methods/:method", (req, res) => {
        res.status(200).json(methods.detail(req.params.method));
    });

}

function addExecutionRoutes(router) {

    router.get("/executions", (req, res) => {
        res.status(200).json(executions.list());
    });

    router.post("/executions", (req, res) => {
        handleExecutionPost(req, res);
    });

    router.delete("/executions/:execution", (req, res) => {
        executions.delete(req.params.execution)
        .then(() => res.status(200).json({}))
        .catch(error => res.status(500).json({"error": error}));
    });

    // TODO Check execution status and file existence, add error handling.

    router.get("/executions/:execution", (req, res) => {
        res.status(200).json(executions.detail(req.params.execution));
    });

    router.get("/executions/:execution/benchmark", (req, res) => {
        const path = executions.getBenchmarkPath(req.params.execution);
        io.fileToResponse(path, res);
    });

    const methodUrlPrefix = "/executions/:execution/methods/:method/";

    router.get(methodUrlPrefix + "summary", (req, res) => {
        const path = executions.getMethodSummaryPath(
            req.params.execution, req.params.method);
        io.fileToResponse(path, res);
    });

    router.get(methodUrlPrefix + "workflow", (req, res) => {
        const path = executions.getMethodWorkflowPath(
            req.params.execution, req.params.method);
        io.fileToResponse(path, res);
    });

    router.get(methodUrlPrefix + "stderr", (req, res) => {
        const path = executions.getMethodErrorOutputPath(
            req.params.execution, req.params.method);
        io.fileToResponse(path, res);
    });

    router.get(methodUrlPrefix + "stdout", (req, res) => {
        const path = executions.getMethodStandardOutputPath(
            req.params.execution, req.params.method);
        io.fileToResponse(path, res);
    });

    // TODO Make sure given path is in the right directory.
    router.get(methodUrlPrefix + "runs/:run/outputs/:file", (req, res) => {
        const params = req.params;
        const path = executions.getRunOutputPath(
            params.execution, params.method, params.run, params.file);
        io.fileToResponse(path, res);
    });

}

// TODO Move following code to other part of the application.

function handleExecutionPost(req, res) {
    executions.create().then((execution) => {
        return parserRequestToExecution(req, execution)
        .then(() => res.status(200).json({"id": execution["id"]}))
        .catch((error) => {
            executions.delete(req.params.id);
            throw error;
        });
    })
    .catch((error) => {
        console.log("error: ", error);
        res.status(500).json({"error": error.toString()})
    });
}

function parserRequestToExecution(req, execution) {
    return new Promise((fulfill, reject) => {
        const form = new multiparty.Form();
        let methodsString = "";
        let optionsString = "";
        form.on("part", (part) => {
            if (part["name"] === "methods") {
                part.on("data", (chunk) => {
                    methodsString += chunk;
                });
            } else if (part["name"] === "execution") {
                part.on("data", (chunk) => {
                    optionsString += chunk;
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
            const methodsId = JSON.parse(methodsString);
            const options = JSON.parse(optionsString);
            const methodsDetail = methodsId.map(id => methods.detail(id));
            executions.initialize(execution, methodsDetail, options)
            .then((record) => {
                executions.onNewExecution(record);
                fulfill(record);
            })
            .catch(reject);
        });
        form.parse(req);
    });
}
