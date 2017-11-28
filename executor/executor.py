#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Application entry point. Can be used to execute method from a command line
or start a web server.

This directory must be in python path in order for methods to works.
"""

import argparse
import logging

import localhost_executor

from plugin_source import FileSystemPluginSource

__license__ = "X11"


def main():
    _init_logging()
    args = _read_args()
    execute(args)


def _init_logging():
    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s [%(levelname)s] - %(message)s",
        datefmt="%H:%M:%S")


def _read_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--plugins", dest="plugins", type=str, required=True,
                        help="Directory with plugins.")
    parser.add_argument("--workflow", dest="workflow", type=str, required=True,
                        help="Path to workflow.json file.")
    parser.add_argument("--working", dest="working", type=str, required=True,
                        help="Path to working directory.")
    parser.add_argument("--input", dest="input", type=str, default=["./input"],
                        nargs="*", help="List of relative input directories.")
    args = parser.parse_args()
    return args


def execute(args):
    plugin_source = _create_source(args["plugins"])
    executor = _create_executor(plugin_source)
    _execute_plugin(args["workflow"], args["working"], executor, args["input"])


def _create_source(root_directory):
    source = FileSystemPluginSource()
    source.load_from_directory(root_directory)
    return source


def _create_executor(plugin_source):
    executor = localhost_executor.WorkflowExecutor()
    executor.set_plugin_storage(plugin_source)
    return executor


def _execute_plugin(
        definition_path,
        working_path,
        executor: localhost_executor.WorkflowExecutor,
        input_directories):
    executor.execute(definition_path, working_path, input_directories)


if __name__ == "__main__":
    main()
