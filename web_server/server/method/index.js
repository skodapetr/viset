"use strict";

const _storage = require("./method-storage");

_storage.initialize();

module.exports = {
    "list": _storage.list,
    "detail": _storage.detail
};