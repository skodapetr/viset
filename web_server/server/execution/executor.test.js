"use strict";

const fs = require("fs");
const expect = require("chai").expect;
const execFactory = require("./execution-factory");
const executor = require("./executor");
const io = require("./io-utils");

const TEST_DIR = "./../data/test/web_server/executor/";

// TODO Add check for frontend file status.

describe("Executor module.", () => {

    before(() => {
        const path = TEST_DIR;
        execFactory.setWorkingPath(path);
        // TODO Change so it can create whole path.
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        executor.setPluginsPath("../tests/executor/plugins")
    });

    it("Execute workflow.", () => {

        const method = readTestMethodWorkflow("write_to_file");

        const options = {
            "label": "Default execution",
            "description": "",
            "type": "default"
        };

        return execute(method, options, executor.startExecution)
        .then(indexRecord => {
            const path = indexRecord["path"] + "/methods/" + method.metadata.id;
            const dataFile = path + "/run-main/output/scores.json";
            expect(fs.existsSync(dataFile)).to.be.true;
        }).catch((error) => {
            console.log(error);
            expect.fail();
        });
    }).timeout(1000);

    it("Execute benchmark.", () => {

        const method = readTestMethodWorkflow("benchmark");
        const benchmark = readTestBenchmark();

        const options = {
            "label": "Benchmark execution",
            "description": "",
            "type": "benchmark",
            "benchmark": benchmark
        };

        return execute(method, options, executor.startBenchmarkExecution)
        .then(indexRecord => {

        }).catch((error) => {
            console.log(error);
            expect.fail();
        });

    }).timeout(60 * 1000);

    after(() => {
        io.deleteDirectory(TEST_DIR);
    });

});

function readTestMethodWorkflow(name) {
    const path = "./../tests/executor/workflow/" + name + ".json";
    return io.fileToJson(path);
}

function readTestBenchmark() {
    const path = "./../tests/executor/benchmark/benchmark.json";
    return io.fileToJson(path);
}

function execute(method, options, executionCall) {
    return execFactory.create()
    .then((ref) => execFactory.initialize(ref, [method], options))
    .then((indexRecord) => {
        const path = indexRecord["path"] + "/methods/" + method.metadata.id;
        return executionCall(path)
        .then(() => Promise.resolve(indexRecord));
    });
}
