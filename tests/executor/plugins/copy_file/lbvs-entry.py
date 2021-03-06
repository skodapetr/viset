#!/usr/bin/env python
# -*- coding: utf-8 -*-
import shutil

from plugin_api import PluginInterface

__license__ = "X11"


class LbvsEntry(PluginInterface):
    def __init__(self):
        self.files = None

    def get_metadata(self):
        return {
            "id": "copy-file"
        }

    def execute(self, files):
        shutil.copy(files["input"], files["output"])
