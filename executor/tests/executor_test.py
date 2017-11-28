#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import tempfile
import unittest

import executor

__license__ = "X11"

TEST_DIRECTORY = os.path.dirname(os.path.abspath(__file__)) + \
                 "/../../tests/executor/execution/"

WORKING_DIRECTORY = tempfile.mkdtemp("", "viset-test-")


class TestExecutor(unittest.TestCase):
    def test_execution(self):
        args = {
            "plugins": TEST_DIRECTORY + "plugins",
            "workflow": TEST_DIRECTORY + "definition.json",
            "working": WORKING_DIRECTORY,
            "input": []
        }
        print("WORK", WORKING_DIRECTORY)
        executor.execute(args)
        # Check existence of output file.
        output_file_path = WORKING_DIRECTORY + "/output/output.dat"
        with open(output_file_path, "r") as stream:
            line = stream.readline()
        self.assertEqual("file content", line)


if __name__ == '__main__':
    unittest.main()
    os.removedirs(WORKING_DIRECTORY)
