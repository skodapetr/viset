#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import unittest
import tempfile
import shutil
import logging

import benchmark_data
from localhost_benchmark import LocalhostBenchmark
import plugin_source

__license__ = "X11"

TEST_DIRECTORY = os.path.dirname(os.path.abspath(__file__)) + \
                 "/../../tests/executor/"

# TODO Change to temp directory in data ?
WORKING_DIRECTORY = tempfile.mkdtemp("", "viset-test-")

plugin_source = plugin_source.FileSystemPluginSource()
plugin_source.load_from_directory(TEST_DIRECTORY + "plugins")

molecule_source = benchmark_data.BenchmarkDataSource()


class TestLocalhostBenchmark(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        delete_cache_data()

    def test_execute_benchmark(self):
        test_dir = os.path.dirname(os.path.abspath(__file__)) + \
                   "/../../tests/executor/"

        executor = LocalhostBenchmark()
        executor.set_definition_file(
            test_dir + "/workflow/benchmark.json")
        executor.set_working_dir(
            WORKING_DIRECTORY + "/benchmark/working")
        executor.set_input_dirs([])
        executor.set_molecule_source(molecule_source)
        executor.set_benchmark_file(
            test_dir + "/benchmark/benchmark.json")
        executor.set_plugin_source(plugin_source)
        executor.execute()

    @classmethod
    def tearDownClass(cls):
        print(WORKING_DIRECTORY)
        # shutil.rmtree(WORKING_DIRECTORY)


def delete_cache_data():
    cache_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "..", "..", "data", "cache", "benchmark", "test_dataset")
    shutil.rmtree(cache_path)


if __name__ == "__main__":
    unittest.main()
