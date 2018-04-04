"use strict";

module.exports = {
    "connect": connect,
    "startExecution": startExecution,
    "startBenchmarkExecution": startBenchmarkExecution,
    "setPluginsPath": setPluginsPath
};

let pluginsPath = "./plugins";
let executor = undefined;

function connect(newExecutor) {
    executor = newExecutor;
}

function startExecution(id, executionDirectory) {
    const command = "python ./executor/executor.py" +
        " --plugins " + pluginsPath +
        " --workflow " + executionDirectory + "/workflow.json" +
        " --input " + executionDirectory + "/../../input" +
        " --directory " + executionDirectory +
        " > " + executionDirectory + "/stdout.log" +
        " 2> " + executionDirectory + "/stderr.log";
    const name = "execution-" + id;
    return executor.start(name, command);
}

function startBenchmarkExecution(id, executionDirectory) {
    const command = "python ./executor/executor.py" +
        " --plugins " + pluginsPath +
        " --workflow " + executionDirectory + "/workflow.json" +
        " --input " + executionDirectory + "/../../input" +
        " --directory " + executionDirectory +
        " --benchmark " + executionDirectory + "/../../benchmark.json" +
        " > " + executionDirectory + "/stdout.log" +
        " 2> " + executionDirectory + "/stderr.log";
    const name = "execution-benchmark-" + id;
    return executor.start(name, command);
}

function setPluginsPath(newPath) {
    pluginsPath = newPath;
}
