#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import tempfile
import unittest
import shutil

import executor

__license__ = "X11"

TEST_DIRECTORY = os.path.dirname(os.path.abspath(__file__)) + \
                 "/../../tests/executor/"

# TODO Change to temp directory in data ?
WORKING_DIRECTORY = tempfile.mkdtemp("", "viset-test-")


class TestExecutor(unittest.TestCase):

    def test_execution(self):
        args = {
            "plugins": TEST_DIRECTORY + "plugins",
            "workflow": TEST_DIRECTORY + "workflow/write_to_file.json",
            "directory": WORKING_DIRECTORY,
            "input": [],
            "benchmark": None
        }
        executor.execute(args)
        # Check existence of output file.
        output_file_path = WORKING_DIRECTORY + "/run-main/output/scores.json"
        with open(output_file_path, "r") as stream:
            line = stream.readline()
        expected_content = "file content"
        self.assertEqual(expected_content, line)

        # TODO Check summary.json file.

    def text_benchmark(self):
        pass

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(WORKING_DIRECTORY)


if __name__ == '__main__':
    unittest.main()
