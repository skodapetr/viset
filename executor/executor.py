#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Application entry point. Can be used to execute method from a command line
or start a web server.

This directory must be in python path in order for methods to works.

Usage examples:

python executor.py --plugins ./../plugins
    --workflow ../workflow.json
    --directory ../temp/execution-benchmark
    --input ../temp/execution-input

python executor.py --plugins ./../plugins
    --workflow ../workflow.json
    --directory ../temp/execution-benchmark
    --input ../temp/execution-input
    --benchmark ../temp/benchmark.json

Output directory structure:
 ./summary.json
 ./run-{}/output
 ./run-{}/working
 ./run-{}/benchmark-evaluation.json // Only for --benchmark mode

"""

import os
import json
import argparse
import logging

import benchmark_data
from localhost_executor import LocalhostExecutor
from localhost_benchmark import LocalhostBenchmark
from plugin_source import FileSystemPluginSource

__license__ = "X11"


def main():
    init_logging()
    args = read_args()

    execute(args)


def init_logging():
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s [%(levelname)s] - %(message)s",
        datefmt="%H:%M:%S")


def read_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--plugins", dest="plugins", type=str,
                        required=True, help="Directory with plugins.")
    parser.add_argument("--workflow", dest="workflow", type=str,
                        required=True, help="Path to definition file.")
    parser.add_argument("--directory", dest="directory", type=str,
                        required=True, help="Path to execution directory.")
    parser.add_argument("--input", dest="input", type=str, default=["./input"],
                        nargs="*", help="List of relative input directories.")
    parser.add_argument("--benchmark", dest="benchmark", type=str,
                        required=False, help="Path to benchmark file.")
    args = parser.parse_args()
    args_as_object = vars(args)
    return args_as_object


def execute(args):
    plugin_source = create_source(args["plugins"])
    if args["benchmark"] is not None:
        logging.info("Benchmark mode")
        execute_benchmark_executor(plugin_source, args)
    else:
        logging.info("Default mode")
        execute_localhost_executor(plugin_source, args)
        create_localhost_executor_summary_file(args)


def create_source(plugin_directory):
    source = FileSystemPluginSource()
    source.load_from_directory(plugin_directory)
    return source


def execute_benchmark_executor(plugin_source, args):
    input_paths = [os.path.abspath(item) for item in args["input"]]
    definition_path = os.path.abspath(args["workflow"])
    benchmark_path = os.path.abspath(args["benchmark"])
    working_path = os.path.abspath(args["directory"])
    #
    executor = LocalhostBenchmark()
    executor.set_definition_file(definition_path)
    executor.set_working_dir(working_path)
    executor.set_input_dirs(input_paths)
    executor.set_molecule_source(benchmark_data.BenchmarkDataSource())
    executor.set_benchmark_file(benchmark_path)
    executor.set_plugin_source(plugin_source)
    executor.execute()


def execute_localhost_executor(plugin_source, args):
    input_paths = [os.path.abspath(item) for item in args["input"]]
    definition_path = os.path.abspath(args["workflow"])
    working_path = os.path.join(args["directory"], "run-main")
    #
    executor = LocalhostExecutor()
    executor.set_plugin_storage(plugin_source)
    executor.execute(definition_path, working_path, input_paths)


def create_localhost_executor_summary_file(args):
    definition = read_json(os.path.join(args["workflow"]))
    summary_path = os.path.join(args["directory"], "summary.json")
    with open(summary_path, "w") as summary_stream:
        json.dump({
            "runs": [{"dir": "run-main"}],
            "type": "default",
            "files": definition["user_interface"]
        }, summary_stream, indent=2)


def read_json(path):
    with open(path) as input_stream:
        return json.load(input_stream)


if __name__ == "__main__":
    main()
