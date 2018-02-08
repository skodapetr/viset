const fs = require("fs");
const io = require("./io-utils");

const datasetsIndex = buildDatasetPublicIndex();
const collectionsIndex = buildCollectionPublicIndex();
const collections = buildCollection(collectionsIndex, datasetsIndex);

module.exports = {
    "datasetIndex": () => datasetsIndex,
    "collectionIndex": () => collectionsIndex,
    "collection": (id) => collections[id],
    "downloadDataset": downloadDataset,
    "downloadCollection": downloadCollection,
    "downloadSelection": downloadSelection
};

function buildDatasetPublicIndex() {
    const result = [];
    const index = loadDatasetIndexFile();
    index["datasets"].forEach((dataset) => {
        const path = "./../data/datasets/" + dataset["dir"];
        const downloaded = fs.existsSync(path);
        const record = {
            "id" : dataset["id"],
            "link" : dataset["link"],
            "label": dataset["label"],
            "doi" : dataset["doi"],
            "downloaded" : downloaded,
            "selections": checkSelectionDownloaded(dataset)
        };
        result.push(record);
    });
    return result;
}

function loadDatasetIndexFile() {
    const path = "./../data/datasets.json";
    return io.fileToJson(path);
}

function checkSelectionDownloaded(dataset) {
    const results = {};
    dataset["selections"].forEach((selection) => {
        const path = "./../data/datasets/" + dataset["dir"] +
            "/selections/" + selection;
        const downloaded = fs.existsSync(path);
        results[selection] = downloaded;
    });
    return results;
}

function buildCollectionPublicIndex() {
    const result = [];
    const index = loadCollectionIndexFile();
    index["collections"].forEach((collection) => {
        const path = "./../data/collections/" + collection["file"];
        const downloaded = fs.existsSync(path);
        const record = {
            "id" : collection["id"],
            "label": collection["label"],
            "file" : collection["file"],
            "downloaded" : downloaded,
            "description" : collection["description"]
        };
        result.push(record);
    });
    return result;
}

function loadCollectionIndexFile() {
    const path = "./../data/collections.json";
    return io.fileToJson(path);
}

function buildCollection(collectionsIndex, datasetsIndex) {
    const result = {};
    collectionsIndex.forEach((collection) => {
        let record;
        if (!collection["downloaded"]) {
            record = createNotDownloadedCollection(collection);
        } else {
            record = createDownloadedCollection(collection, datasetsIndex);
        }
        result[collection["id"]] = record;
    });
    return result;
}

function createNotDownloadedCollection(collection) {
    return {
        "id": collection["id"],
        "file": collection["file"],
        "downloaded" : false,
        "metadata": {
            "label": collection["label"],
            "description" : collection["description"]
        }
    };
}

function createDownloadedCollection(collection, datasetsIndex) {
    const path = "./../data/collections/" + collection["file"];
    const definition = io.fileToJson(path);
    checkDatasetsForCollection(definition, datasetsIndex);
    return {
        "id": collection["id"],
        "file": collection["file"],
        "downloaded" : true,
        "metadata": definition["metadata"],
        "data": definition["data"]
    };
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
        let item = datasetsIndex[index];
        if (item["dir"] !== dataset) {
            continue;
        }
        return item["selections"][selection];
    }
    return false;
}

function downloadDataset(id) {

}

function downloadCollection(id) {

}

function downloadSelection(dataset, selection) {

}
