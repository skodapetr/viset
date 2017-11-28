#!/usr/bin/env python
# -*- coding: utf-8 -*-

import imp
import os
import typing

from plugin_api import PluginInterface, PluginSourceInterface

__license__ = "X11"

# TODO Change to viset_plugin.py
_ENTRY_POINT_FILE_NAME = "lbvs-entry.py"


class FileSystemPluginSource(PluginSourceInterface):
    """
    Plugin manager.
    """

    def __init__(self):
        self.plugins = {}
        self.metadata_list = []

    def load_from_directory(self, methods_directory):
        for path in self._generate_entry_files(methods_directory):
            self._load_and_add_plugin(path)
        self._build_metadata_list()

    def _load_and_add_plugin(self, path):
        module = self._load_module(path)
        instance = typing.cast(PluginInterface, module.LbvsEntry())
        metadata = instance.get_metadata()
        self.plugins[metadata["id"]] = {
            "metadata": metadata,
            "instance": instance
        }

    def _build_metadata_list(self):
        self.metadata_list = \
            [item["metadata"] for item in self.plugins.values()]

    @staticmethod
    def _generate_entry_files(directory: str):
        for file in os.listdir(directory):
            path = directory + "/" + file
            if file == _ENTRY_POINT_FILE_NAME and os.path.isfile(path):
                yield path
            if os.path.isdir(path):
                for item in FileSystemPluginSource._generate_entry_files(path):
                    yield item

    @staticmethod
    def _load_module(path: str):
        return imp.load_source(path, path)

    def get_plugin(self, plugin):
        plugin_id = plugin["id"]
        if plugin_id not in self.plugins:
            raise Exception("Missing plugin with id: " + plugin_id)
        return self.plugins[plugin_id]["instance"]

    def get_metadata(self):
        return self.metadata_list
