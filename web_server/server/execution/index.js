"use strict";

const storage = require("./execution-storage");
storage.initialize();

const factory = require("./execution-factory");
factory.connect(require("./../method"));

const executor = require("./execution-executor");
executor.connect(require("./../executor"));

const scheduler = require("./execution-scheduler");
scheduler.connect(executor, storage);
scheduler.start();

module.exports = {
    "list": storage.list,
    "detail": storage.detail,
    "delete": storage.delete,
    // TODO: Hide from API.
    "onNewExecution": storage.onNewExecution,
    //
    "getBenchmarkPath":storage.getBenchmarkPath,
    "getMethodSummaryPath":storage.getMethodSummaryPath,
    "getMethodWorkflowPath":storage.getMethodWorkflowPath,
    "getMethodErrorOutputPath":storage.getMethodErrorOutputPath,
    "getMethodStandardOutputPath":storage.getMethodStandardOutputPath,
    "getRunOutputPath":storage.getRunOutputPath,
    //
    "initialize": factory.initialize,
    "create": factory.create
};

