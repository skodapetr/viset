"use strict";

const fs = require("fs");
const io = require("./../io-utils");

module.exports = {
    "initialize": initialize,
    "list": () => datasetsIndex,
    "detail": (id) => datasetsDetails[id],
    "canStartDownload": canStartDownload,
    "onStartDownload": onStartDownload,
    "onFinishDownload": onFinishDownload
};

let datasetsIndex = [];
let datasetsDetails = {};

function initialize() {
    datasetsDetails = buildDatasetsDetails();
    datasetsIndex = buildDatasetIndex(datasetsDetails);
}

function buildDatasetsDetails() {
    const result = {};
    const index = loadDatasetIndexFile();
    index["datasets"].forEach((dataset) => {
        const datasetDetail = createDatasetDetail(dataset);
        updateDownloadStatus(datasetDetail);
        const link = decodeURIComponent(datasetDetail["id"]);
        result[link] = datasetDetail;
    });
    return result;
}

function loadDatasetIndexFile() {
    const path = "./../data/datasets.json";
    return io.fileToJson(path);
}

function createDatasetDetail(dataset) {
    return {
        "id": dataset["id"],
        "label": dataset["label"],
        "doi": dataset["doi"],
        "selections": buildSelections(dataset),
        "downloading": false
    };
}

function datasetDir(dataset) {
    return "./../data/datasets/" + dataset["id"];
}

function buildSelections(dataset) {
    return dataset["selections"].map((selection) => ({
        "id": selection["id"],
        "label": selection["label"],
        "groups": listGroups(dataset, selection)
    }));
}

function selectionDir(dataset, selection) {
    return datasetDir(dataset) + "/selections/" + selection["id"];
}

function listGroups(dataset, selection) {
    const dir = selectionDir(dataset, selection);
    if (!fs.existsSync(dir)) {
        return [];
    }
    const groups = [];
    fs.readdirSync(dir).forEach(file => {
        groups.push(file);
    });
    return groups;
}

function updateDownloadStatus(dataset) {
    dataset["downloaded"] = fs.existsSync(datasetDir(dataset));
    dataset["selections"].forEach((selection) => {
        const path = selectionDir(dataset, selection);
        selection["downloaded"] = fs.existsSync(path);
    });
}

function updateSelectionGroups(dataset) {
    dataset["selections"].forEach((selection) => {
        selection["groups"] = listGroups(dataset, selection);
    });
}

function buildDatasetIndex(datasets) {
    return Object.values(datasets).map(
        dataset => createDatasetIndexRecord(dataset));
}

function createDatasetIndexRecord(dataset) {
    return {
        "id": dataset["id"],
        "label": dataset["label"],
        "doi": dataset["doi"],
        "downloaded": dataset["downloaded"],
        "downloading": dataset["downloading"],
        "selections": dataset["selections"].map(selection => ({
            "id": selection["id"],
            "label": selection["label"],
            "downloaded": selection["downloaded"]
        }))
    };
}

function canStartDownload(datasetId) {
    const dataset = datasetsDetails[datasetId];
    if (dataset["downloading"]) {
        return false;
    }
    if (!dataset["downloaded"]) {
        return true;
    }
    for (let index = 0; index < dataset["selections"].length; ++index) {
        const selection = dataset["selections"][index];
        if (!selection["downloaded"]) {
            return true;
        }
    }
    return false;
}

function onStartDownload(datasetId) {
    const dataset = datasetsDetails[datasetId];
    dataset["downloading"] = true;
    updateIndexRecord(dataset);
}

function updateIndexRecord(dataset) {
    const index = findIndexOfDataset(dataset);
    if (index === undefined) {
        datasetsIndex.push(createDatasetIndexRecord(dataset));
    } else {
        datasetsIndex[index] = createDatasetIndexRecord(dataset);
    }
}

function findIndexOfDataset(dataset) {
    for (let index = 0; index < datasetsIndex.length; ++index) {
        if (dataset["id"] === datasetsIndex[index]["id"]) {
            return index;
        }
    }
    return undefined;
}

function onFinishDownload(datasetId) {
    const dataset = datasetsDetails[datasetId];
    dataset["downloading"] = false;
    updateDownloadStatus(dataset);
    updateSelectionGroups(dataset);
    updateIndexRecord(dataset);
}
