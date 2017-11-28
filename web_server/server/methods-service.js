"use strict";

const fs = require("fs");
const io = require("./io-utils");

class IndexRecord {
    constructor(method) {
        this.id = method["metadata"]["id"];
        this.data = method;
    }
}

const index = buildIndex();
const publicList = createPublicList(index);

module.exports = {
    "list": () => publicList,
    "get": getMethod
};

function buildIndex() {
    const index = {};
    const methodDirectory = getMethodsDirectory();
    fs.readdirSync(methodDirectory).forEach(file => {
        const path = methodDirectory + file;
        try {
            const method = io.fileToJson(path);
            const record = new IndexRecord(method);
            index[record.id] = record;
        } catch (exception) {
            console.warn("Invalid method: ", path);
        }
    });
    return index;
}

function getMethodsDirectory() {
    return "./../data/methods/";
}

function createPublicList(index) {
    const output = [];
    for (let id in index) {
        const method = index[id]["data"];
        output.push({
            "id": id,
            "label": method["metadata"]["label"],
            "description": method["metadata"]["description"],
            "version": method["metadata"]["version"]
        })
    }
    return output;
}

function getMethod(id) {
    const method = index[id];
    if (method === undefined) {
        return undefined;
    }
    return method["data"];
}