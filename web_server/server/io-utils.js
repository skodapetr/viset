"use strict";

const fs = require("fs");
const rimraf = require("rimraf");

module.exports = {
    "streamToFile": streamToFile,
    "fileToStream": fileToStream,
    "fileToResponse": fileToResponse,
    "stringToFile": stringToFile,
    "jsonToFile": jsonToFile,
    "mkdirAsynch": mkdirAsynch,
    "fileToJson": fileToJson,
    "deleteDirectory": deleteDirectory
};

function streamToFile(stream, path) {
    const outputStream = fs.createWriteStream(path);
    stream.pipe(outputStream);
}

function fileToStream(path, stream) {
    const inputStream = fs.createReadStream(path);
    inputStream.pipe(stream);
}

function fileToResponse(path, response) {
    if (fs.existsSync(path)) {
        response.status(200);
        fileToStream(path, response);
    } else {
        response.status(404);
    }
}

function stringToFile(content, path) {
    return new Promise((fulfill, reject) => {
        fs.writeFile(path, content, "utf8", callbackToPromise(fulfill, reject));
    });
}

function jsonToFile(content, path) {
    const contentAsString = JSON.stringify(content, null, 2);
    return stringToFile(contentAsString, path)
}

function mkdirAsynch(path) {
    return new Promise((fulfill, reject) => {
        fs.mkdir(path, callbackToPromise(fulfill, reject));
    });
}

function callbackToPromise(fulfill, reject) {
    return (error) => {
        if (error) {
            reject(error);
        } else {
            fulfill();
        }
    }
}

function fileToJson(path) {
    return JSON.parse(fs.readFileSync(path, "utf8"));
}

function deleteDirectory(path) {
    return new Promise((fulfill, reject) => {
        const options = {"disableGlob" : true};
        rimraf(path, options, (error) => {
            if (error) {
                reject(error);
            } else {
                fulfill();
            }
        });
    });
}
