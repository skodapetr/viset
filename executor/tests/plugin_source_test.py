#!/usr/bin/env python
# -*- coding: utf-8 -*-
import unittest
import os

from plugin_source import FileSystemPluginSource

__license__ = "X11"

TEST_DIRECTORY = os.path.dirname(os.path.abspath(__file__)) + \
                 "/../../tests/executor/"


class TestPluginStorage(unittest.TestCase):
    def test_load_plugins(self):
        storage = FileSystemPluginSource()
        storage.load_from_directory(TEST_DIRECTORY + "plugins")
        self.assertEqual(4, len(storage.get_metadata()))

    def test_get_plugin(self):
        storage = FileSystemPluginSource()
        storage.load_from_directory(TEST_DIRECTORY + "plugins")
        self.assertIsNotNone(storage.get_plugin({"id": "test"}))

    def test_get_plugin(self):
        storage = FileSystemPluginSource()
        storage.load_from_directory(TEST_DIRECTORY + "plugins")
        instance = storage.get_plugin({"id": "test"})
        files = {"number": 3}
        instance.execute(files)
        self.assertEqual(files, instance.files)

    def test_load_missing(self):
        storage = FileSystemPluginSource()
        storage.load_from_directory(TEST_DIRECTORY + "plugins")
        self.assertRaises(Exception, storage.get_plugin, {"id": "missing"})


if __name__ == '__main__':
    unittest.main()
