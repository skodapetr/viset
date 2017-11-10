#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Provide wrap of methods so they can be used in workflow.
"""

import methods_api as methods_api
import methods_storage as methods
import workflow_executor as workflow

__license__ = "X11"


class MethodPlugin(workflow.Plugin):
    """
    Wrap method so it can be used as a workflow plugin.
    """

    def __init__(self, component, method: methods_api.MethodInterface):
        self.definition = component
        self.instance = method

    def execute(self, ports):
        action_type = self.definition["type"]
        methods.execute_method_instance(self.instance, action_type, ports)

    def configure(self, configuration):
        methods.configure_instance(self.instance, configuration)


class MethodsSource(workflow.PluginSource):
    """
    Wrap MethodStorage so it can be used as PluginSource.
    """

    def __init__(self, storage: methods.MethodStorage):
        self.storage = storage

    def get_plugin(self, component) -> MethodPlugin:
        method = self.storage.get_instance(component["id"])
        wrap = MethodPlugin(component, method)
        return wrap
