"use strict";

const expect = require("chai").expect;
const collections = require("./collection-storage");
const datasets = require("./dataset-storage");

describe("Collection storage.", () => {

    before(() => {
        collections.initialize();
    });

    it("List is not empty.", () => {
        const list = collections.list();
        expect(list).to.not.be.empty;
    });

    it("Detail is defined.", () => {
        const detail = collections.detail("00");
        expect(detail).to.not.be.undefined;
    });

    it("Detail for missing is undefined.", () => {
        const detail = collections.detail("missing-key");
        expect(detail).to.be.undefined;
    });

    it("Compute 'download' property.", () => {
        const detail = collections.detail("00");
        expect(detail, "Missing collection.").to.not.be.undefined;
        const ref = detail.data["0.50-0.60"]["0"];
        expect(ref, "Missing dataset.").to.not.be.undefined;
        expect(ref.downloaded).to.be.undefined;
        datasets.initialize();
        collections.updateDownloadStatus(datasets.list());
        expect(ref.downloaded, "Are datasets downloaded?").to.be.true;
    });

});
