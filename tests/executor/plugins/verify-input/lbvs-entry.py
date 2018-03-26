#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from plugin_api import PluginInterface

__license__ = "X11"


class LbvsEntry(PluginInterface):
    def __init__(self):
        self.files = None

    def get_metadata(self):
        return {
            "id": "verify-input"
        }

    def execute(self, files):
        for key in files.keys():
            file = files[key]
            if not os.path.exists(file):
                raise Exception("Missing port file: " + key + " >> " + file)
