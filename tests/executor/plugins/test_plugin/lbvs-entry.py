#!/usr/bin/env python
# -*- coding: utf-8 -*-


from plugin_api import PluginInterface

__license__ = "X11"


class LbvsEntry(PluginInterface):
    def __init__(self):
        self.files = None

    def get_metadata(self):
        return {
            "id": "test"
        }

    def execute(self, files):
        self.files = files
