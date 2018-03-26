#!/usr/bin/env python
# -*- coding: utf-8 -*

import os
import tempfile
import unittest
import shutil
import logging

from localhost_executor import LocalhostExecutor
from plugin_api import PluginInterface, PluginSourceInterface

__license__ = "X11"

TEST_DIRECTORY = "./tests/executor/workflow/"


# TODO Export to plugins

class DoNothingPlugin(PluginInterface):

    def get_metadata(self):
        raise NotImplementedError

    def __init__(self):
        super().__init__()
        self.ports = None

    def execute(self, ports):
        self.ports = ports

# TODO Remove this class

class SimplePluginSource(PluginSourceInterface):
    def __init__(self):
        self.plugins = {
            "do-nothing": DoNothingPlugin(),
            "do-nothing-2": DoNothingPlugin()
        }

    def get_plugin(self, component) -> PluginInterface:
        return self.plugins[component["id"]]

    def get_metadata(self):
        raise NotImplementedError("Please implement this method.")


WORKING_DIRECTORY = tempfile.mkdtemp("", "viset-test-")


class TestLocalhostExecutor(unittest.TestCase):
    plugin_source = SimplePluginSource()

    def test_execute_single_plugins(self):
        executor = LocalhostExecutor()
        executor.set_plugin_storage(self.plugin_source)
        executor.execute(TEST_DIRECTORY + "single_plugin.json",
                         WORKING_DIRECTORY,
                         [])
        plugin = self.plugin_source.plugins["do-nothing"]
        self.assertEqual({"value": 2}, plugin.configuration)
        self.assertEqual(os.path.join(WORKING_DIRECTORY, "output", "data.dat"),
                         plugin.ports["output"])

    def test_missing_input_file(self):
        executor = LocalhostExecutor()
        executor.set_plugin_storage(self.plugin_source)
        with self.assertRaises(Exception):
            executor.execute(TEST_DIRECTORY + "connected_plugins.json",
                             WORKING_DIRECTORY,
                             [])

    def test_connected_plugins_with_input_and_working_file(self):
        executor = LocalhostExecutor()
        this_dir = os.path.dirname(os.path.abspath(__file__))
        input_directory = this_dir + "/../../" + TEST_DIRECTORY
        executor.set_plugin_storage(self.plugin_source)
        executor.execute(TEST_DIRECTORY + "connected_plugins.json",
                         WORKING_DIRECTORY,
                         [input_directory])

        plugin = self.plugin_source.plugins["do-nothing"]
        self.assertEqual({"order": 1}, plugin.configuration)

        plugin_2 = self.plugin_source.plugins["do-nothing-2"]
        self.assertEqual({"order": 2}, plugin_2.configuration)

        self.assertEqual(plugin.ports["output"], plugin_2.ports["input"])

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(WORKING_DIRECTORY)


if __name__ == '__main__':
    unittest.main()
