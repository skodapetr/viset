"use strict";

const fs = require("fs");
const io = require("./../io-utils");

module.exports = {
    "initialize": initialize,
    "list": () => collectionsIndex,
    "detail": (id) => collections[id],
    "updateDownloadStatus": updateDownloadStatus
};

let collectionsIndex;
let collections;

function initialize() {
    collectionsIndex = buildCollectionPublicIndex();
    collections = buildCollectionsDetail(collectionsIndex);
}

function buildCollectionPublicIndex() {
    const result = [];
    fs.readdirSync(collectionDirectory()).forEach(file => {
        const path = collectionDirectory() + file;
        try {
            const collection = io.fileToJson(path);
            const metadata = collection["metadata"];
            result.push({
                "id": metadata["id"],
                "file": file,
                "label": metadata["label"],
                "description": metadata["description"]
            })
        } catch (exception) {
            console.warn("Invalid collection: ", path);
        }
    });
    return result;
}

function collectionDirectory() {
    return "./../data/collections/";
}

function buildCollectionsDetail(collectionsIndex) {
    const result = {};
    collectionsIndex.forEach((collection) => {
        result[collection["id"]] = createCollectionDetail(collection);
    });
    return result;
}

function createCollectionDetail(collection) {
    const path = "./../data/collections/" + collection["file"];
    const definition = io.fileToJson(path);
    return {
        "id": collection["id"],
        "file": collection["file"],
        "metadata": definition["metadata"],
        "data": definition["data"]
    };
}

function updateDownloadStatus(datasets) {
    for (let key in collections) {
        const collection = collections[key];
        checkDatasetsForCollection(collection, datasets);
    }
}

function checkDatasetsForCollection(definition, datasetsIndex) {
    Object.values(definition["data"]).forEach((group) => {
        group.forEach((dataset) => {
            dataset["downloaded"] = checkCollectionDownloaded(
                dataset["dataset"], dataset["selection"], datasetsIndex);
        });
    });
}

function checkCollectionDownloaded(dataset, selection, datasetsIndex) {
    for (let index in datasetsIndex) {
        if (!datasetsIndex.hasOwnProperty(index)) {
            continue;
        }
        let item = datasetsIndex[index];
        if (item["id"] !== dataset) {
            continue;
        }
        return item["selections"][selection];
    }
    return false;
}
