"use strict";

const express = require("express");
const multiparty = require("multiparty");
const executions = require("./execution-service");
const methods = require("./methods-service");
const io = require("./io-utils");

(function initialize() {
    const router = express.Router();
    addMethodsRoutes(router);
    addExecutionRoutes(router);
    module.exports = router;
})();

// TODO Handle promise failures.
// TODO Split routes into files and introduce index.js as an aggregation.

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
    console.log("start");
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
        form.on("part", (part) => {
            if (part["name"] === "methods") {
                part.on("data", function (chunk) {
                    methodsString += chunk;
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
            console.log("methodsString", methodsString);
            const methodIds = JSON.parse(methodsString);
            executions.initializeExecution(execution, methodIds)
            .then(fulfill)
            .catch(reject);
        });
        form.parse(req);
    });
}
