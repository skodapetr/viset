"use strict";

const storage = require("./dataset-storage");
storage.initialize();

const executor = require("./../executor");

const downloader = require("./dataset-downloader");
downloader.connect(storage, executor);

module.exports = {
    "list": storage.list,
    "detail": storage.detail,
    "download": downloader.download
};