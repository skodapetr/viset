#!/usr/bin/env python
# -*- coding: utf-8 -*-
import unittest

from plugin_source import FileSystemPluginSource

__license__ = "X11"

TEST_DIRECTORY = "./tests/executor/"


class TestPluginStorage(unittest.TestCase):
    def test_load_plugins(self):
        storage = FileSystemPluginSource()
        storage.load_from_directory(TEST_DIRECTORY + "plugins")
        self.assertEqual(1, len(storage.get_metadata()))
        self.assertEqual("test", storage.get_metadata()[0]["id"])

    def test_get_plugin(self):
        storage = FileSystemPluginSource()
        storage.load_from_directory(TEST_DIRECTORY + "plugins")
        self.assertIsNotNone(storage.get_plugin({"id": "test"}))

    def test_get_plugin(self):
        storage = FileSystemPluginSource()
        storage.load_from_directory(TEST_DIRECTORY + "plugins")
        instance = storage.get_plugin({"id": "test"})
        files = {"number": 1}
        instance.execute(files)
        self.assertEqual(files, instance.files)


if __name__ == '__main__':
    unittest.main()
