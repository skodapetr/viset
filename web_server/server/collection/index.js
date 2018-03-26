"use strict";

const storage = require("./collection-storage");

storage.initialize();

module.exports = {
    "list": storage.list,
    "detail": storage.detail,
    "updateDownloadStatus": storage.updateDownloadStatus
};