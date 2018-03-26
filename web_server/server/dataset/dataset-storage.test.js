"use strict";

const expect = require("chai").expect;
const datasets = require("./dataset-storage");

describe("Dataset storage.", () => {

    before(() => {
        datasets.initialize();
    });

    it("List is not empty.", () => {
        const list = datasets.list();
        expect(list).to.not.be.empty;
    });

});
