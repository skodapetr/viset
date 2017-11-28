#!/usr/bin/env python
# -*- coding: utf-8 -*
import os
import tempfile
import unittest

from localhost_executor import WorkflowExecutor
from plugin_api import PluginInterface, PluginSourceInterface

__license__ = "X11"

TEST_DIRECTORY = "./tests/executor/workflow/"


class DoNothingPlugin(PluginInterface):
    def __init__(self):
        self.configuration = None
        self.ports = None

    def configure(self, configuration):
        self.configuration = configuration

    def execute(self, ports):
        self.ports = ports


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


WORKING_DIRECTORY = WORKING_DIRECTORY = tempfile.mkdtemp("", "viset-test-")


class TestWorkflowExecutor(unittest.TestCase):
    plugin_source = SimplePluginSource()

    def test_execute_single_plugins(self):
        executor = WorkflowExecutor()
        executor.set_plugin_storage(self.plugin_source)
        executor.execute(TEST_DIRECTORY + "single_plugin.json",
                         WORKING_DIRECTORY,
                         [])
        plugin = self.plugin_source.plugins["do-nothing"]
        self.assertEqual({"value": 2}, plugin.configuration)
        self.assertEqual(os.path.join(WORKING_DIRECTORY, "output.dat"),
                         plugin.ports["output"])

    def test_missing_input_file(self):
        executor = WorkflowExecutor()
        executor.set_plugin_storage(self.plugin_source)
        with self.assertRaises(Exception):
            executor.execute(TEST_DIRECTORY + "connected_plugins.json",
                             WORKING_DIRECTORY,
                             [])

    def test_connected_plugins_with_input_and_working_file(self):
        executor = WorkflowExecutor()
        input_directory = os.path.dirname(
            os.path.abspath(__file__)) + "/../../" + TEST_DIRECTORY
        executor.set_plugin_storage(self.plugin_source)
        executor.execute(TEST_DIRECTORY + "connected_plugins.json",
                         WORKING_DIRECTORY,
                         [input_directory])

        plugin = self.plugin_source.plugins["do-nothing"]
        self.assertEqual({"order": 1}, plugin.configuration)

        plugin_2 = self.plugin_source.plugins["do-nothing-2"]
        self.assertEqual({"order": 2}, plugin_2.configuration)

        self.assertEqual(plugin.ports["output"], plugin_2.ports["input"])


if __name__ == '__main__':
    unittest.main()
    os.removedirs(WORKING_DIRECTORY)
