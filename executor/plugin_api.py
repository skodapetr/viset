#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Provides interface and storage class for LBVS methods.

Representation interface files:
* database_file
* output_file

Similarity interface files:
* query_file
* database_file
* output_file

Fusion interface files:
* similarity_file
* output_file

"""

import abc
import typing

__license__ = "X11"


class PluginInterface(object):
    __metaclass__ = abc.ABCMeta

    def __init__(self):
        self.configuration = {}

    @abc.abstractmethod
    def get_metadata(self) -> object:
        """Return plugin's metadata."""

    def configure(self, configuration: object):
        self.configuration = configuration

    @abc.abstractmethod
    def execute(self, files: typing.Dict[str, str]):
        """Execute given plugin with given files."""


class PluginSourceInterface(object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def get_plugin(self, plugin):
        """Get plugin of given name."""

    @abc.abstractmethod
    def get_metadata(self):
        """Return metadata records for every plugin."""
