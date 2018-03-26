"use strict";

const fs = require("fs");

module.exports = {
    "connect": connect,
    "download": download
};

let storage = undefined;
let executor = undefined;

function connect(newStorage, newExecutor) {
    storage = newStorage;
    executor = newExecutor;
}

function download(datasetId) {
    if (storage === undefined || executor === undefined) {
        throw {"label": "Downloader is not initialized.", "type": "exception"}
    }
    const name = "dataset-download:" + datasetId;
    if (!storage.canStartDownload(datasetId) || executor.isRunning(name)) {
        return {"label" : "Can not start download.", "type": "failure"};
    }
    const command = downloadCommand(datasetId);
    storage.onStartDownload(datasetId);
    executor.start(name, command)
    .then(() => storage.onFinishDownload(datasetId))
    .catch((error) => {
        storage.onFinishDownload(datasetId);
        console.log("Can not download dataset: " + datasetId);
        console.error(error);
    });
    return {"type": "ok"}
}

function downloadCommand(datasetId) {
    return "python ./backend/scripts/download_dataset.py -d " + datasetId;
}
