#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Application entry point. Can be used to execute method from a command line
or start a web server.

This directory must be in python path in order for methods to works.
"""

import argparse
import logging

import methods_storage
import methods_workflow_wrap
import workflow_executor

__license__ = "X11"


def main():
    init_logging()
    args = read_args()
    plugin_source = create_storage(args.plugins)
    executor = create_executor(plugin_source)
    execute(args.workflow, executor, args.input)


def init_logging():
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s [%(levelname)s] - %(message)s",
        datefmt="%H:%M:%S")


def read_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--plugins", dest="plugins", type=str, required=True,
                        help="Directory with plugins.")
    parser.add_argument("--workflow", dest="workflow", type=str, required=True,
                        help="Directory with workflow.json file.")
    parser.add_argument("--input", dest="input", type=str, default=["./input"],
                        nargs="*", help="List of relative input directories.")
    args = parser.parse_args()
    return args


def create_storage(root_directory):
    storage = methods_storage.MethodStorage()
    storage.load_methods_from_directory(root_directory)
    return methods_workflow_wrap.MethodsSource(storage)


def create_executor(plugin_source):
    executor = workflow_executor.WorkflowExecutor()
    executor.set_plugin_source(plugin_source)
    return executor


def execute(path, executor: workflow_executor.WorkflowExecutor,
            input_directories):
    executor.execute_pipeline(path, input_directories)


if __name__ == "__main__":
    main()
