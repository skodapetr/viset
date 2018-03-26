"use strict";

const expect = require("chai").expect;
const methods = require("./method-storage");

describe("Method module.", () => {

    before(() => {
        methods.initialize();
    });

    it("List is not empty.", () => {
        const list = methods.list();
        expect(list).to.not.be.empty;
    });

});
