"use strict";

const fs = require("fs");
const expect = require("chai").expect;
const execFactory = require("./execution-factory");
const io = require("./io-utils");

const TEST_DIR = "./../data/test/web_server/execution/";

describe("Execution factory.", () => {

    before(() => {
        execFactory.setWorkingPath(TEST_DIR);
        // TODO Change so it can create whole path.
        if (!fs.existsSync(TEST_DIR)) {
            fs.mkdirSync(TEST_DIR);
        }
    });

    it("Create execution reference.", () => {
        const ref = execFactory.createReference("id", "path");
        expect(ref.id).to.be.equal("id");
        expect(ref.path).to.be.equal("path");
    });

    it("Create execution.", () => {
        return execFactory.create().then((ref) => {
            expect(fs.existsSync(ref["path"])).to.be.true;
            expect(fs.existsSync(ref["path"] + "/input")).to.be.true;
        });
    });

    it("Create and initialize execution.", () => {
        const methods = [
            {"metadata": {"id": "0", "label": "z"}}
        ];
        const options = {
            "label": "Execution label.",
            "description": "Execution description.",
            "type": "default"
        };
        return execFactory.create()
        .then((ref) => execFactory.initialize(ref, methods, options))
        .then((indexRecord) => {
            const methodPath = indexRecord["path"] + "/methods/0";
            expect(fs.existsSync(methodPath)).to.be.true;
            expect(fs.existsSync(methodPath + "/working")).to.be.true;
            expect(fs.existsSync(methodPath + "/output")).to.be.true;
            expect(fs.existsSync(methodPath + "/workflow.json")).to.be.true;

            const expectFrontendFile = {
                "id": indexRecord.id,
                "label": "Execution label.",
                "description": "Execution description.",
                "type": "default",
                "methods": {"0": {"id": "0", "label": "z", "status": "queued"}}
            };
            expect(io.fileToJson(indexRecord["path"] + "/frontend-index.json"))
            .to.deep.equal(expectFrontendFile)

        });
    });

    it("Create and initialize benchmark execution.", () => {
        const methods = [
            {"metadata": {"id": "0", "label": "z"}}
        ];
        const options = {
            "label": "Execution label.",
            "description": "Execution description.",
            "type": "default",
            "benchmark": {
                "data": [{"dataset": "1"}, {"dataset": "2"}]
            }
        };
        const expectBenchmarkFile = {
            "data": [
                {"dataset": "1"},
                {"dataset": "2"}
            ]
        };
        return execFactory.create()
        .then((ref) => execFactory.initialize(ref, methods, options))
        .then((indexRecord) => {
            const methodPath = indexRecord["path"] + "/methods/0";
            expect(fs.existsSync(methodPath)).to.be.true;
            expect(fs.existsSync(methodPath + "/working")).to.be.true;
            expect(fs.existsSync(methodPath + "/output")).to.be.true;
            expect(fs.existsSync(methodPath + "/workflow.json")).to.be.true;
            expect(io.fileToJson(indexRecord["path"] + "/benchmark.json"))
            .to.deep.equal(expectBenchmarkFile)
        });
    });

    after(() => {
        io.deleteDirectory(TEST_DIR);
    })

});

