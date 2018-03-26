"use strict";

const exec = require("child_process").exec;

module.exports = {
    "isRunning": isRunning,
    "start": start
};

const running = {};

function isRunning(name) {
    return running[name] !== undefined;
}

function start(name, command) {
    return new Promise((resolve, reject) => {
        console.log("executor.start:", name, command);
        const options = createOptions();
        // TODO Store stdout, stderr and return code somewhere.
        const child = exec(command, options, (error, stdout, stderr) => {
            console.log("executor.finished: ", name, command);
            delete running[name];
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
        running[name] = child;
    });
}

function createOptions() {
    return {
        "cwd": "./../"
    };
}
