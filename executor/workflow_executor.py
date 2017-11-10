#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Python Simple Workflow executor
"""

import json
import logging
import os
from typing import List

__license__ = "X11"


class Plugin(object):
    """
    Interface of a basic pipeline composition unit.
    """

    def configure(self, configuration):
        """
        Configure component.
        """
        raise NotImplementedError("Please implement this method.")

    def execute(self, ports):
        """
        Execute component.
        """
        raise NotImplementedError("Please implement this method.")


class PluginSource(object):
    """
    Source of plugins that can be executed in pipeline.
    """

    def get_plugin(self, component) -> Plugin:
        raise NotImplementedError("Please implement this method.")


class WorkflowExecutor(object):
    """
    Pipeline executor.
    """

    def __init__(self):
        self.directory = None
        self.input_directories = None
        self.plugin_source = None

    def set_plugin_source(self, plugin_source: PluginSource):
        self.plugin_source = plugin_source

    def execute_pipeline(self, pipeline_directory: str,
                         input_directories: List[str]):
        self._initialize_directories(pipeline_directory, input_directories)
        self._load_pipeline()
        self._create_directories()
        self._execute_components()
        # TODO Perform cleanup

    def _initialize_directories(self, pipeline_directory, input_directories):
        self.directory = os.path.abspath(pipeline_directory)
        self.input_directories = [self._expand_relative_path(directory)
                                  for directory in input_directories]

    def _expand_relative_path(self, path):
        return os.path.join(self.directory, path)

    def _load_pipeline(self):
        pipeline_file = os.path.join(self.directory, "workflow.json")
        with open(pipeline_file, "r") as stream:
            content = json.load(stream)
        self.pipeline = content["workflow"]

    def _create_directories(self):
        os.makedirs(self._get_working(), exist_ok=True)
        os.makedirs(self._get_output(), exist_ok=True)

    def _get_input(self):
        """
        Get pipeline input directory.
        """
        return os.path.join(self.directory, "input")

    def _get_working(self):
        """
        Get pipeline working directory.
        """
        return os.path.join(self.directory, "working")

    def _get_output(self):
        """
        Get pipeline output directory.
        """
        return os.path.join(self.directory, "output")

    def _execute_components(self):
        for component in self.pipeline:
            component_label = self._get_label(component)
            logging.info("Executing '%s' ...", component_label)
            self._execute_component(component)
            logging.info("Executing '%s' ... done", component_label)

    def _execute_component(self, component):
        instance = self._get_component(component)
        ports = self._prepare_ports(component["ports"])
        self._configure_instance(component, instance)
        instance.execute(ports)

    @staticmethod
    def _get_label(component):
        if "label" in component:
            return component["label"]
        else:
            return component["id"]

    def _get_component(self, component):
        return self.plugin_source.get_plugin(component)

    @staticmethod
    def _configure_instance(component, instance):
        if "configuration" in component:
            instance.configure(component["configuration"])

    def _prepare_ports(self, ports):
        output = {}
        for port_id in ports.keys():
            port_value = ports[port_id]
            if port_value.startswith("input"):
                output[port_id] = self._resolve_port_path(port_value)
            else:
                output[port_id] = self._expand_relative_path(port_value)
        return output

    def _resolve_port_path(self, path):
        relative_path = path[path.index("/") + 1:]
        for directory in self.input_directories:
            candidate_path = os.path.join(directory, relative_path)
            if os.path.isfile(candidate_path):
                return candidate_path
        raise Exception("Missing input file: " + path)


class DirectoryBasedPluginSource(PluginSource):
    """
    Directory based plugin loader.

    User must provide a function to extract instance from the module.
    """

    def __init__(self, plugin_directory):
        self.plugin_directory = plugin_directory
        self.get_instance_from_module = None

    def set_instance_extractor(self, instance_extractor):
        """
        Set function used to extract module from instance.
        """
        self.get_instance_from_module = instance_extractor

    def get_plugin(self, component) -> Plugin:
        path = os.path.join(self.plugin_directory, component["id"] + ".py")
        module = _load_module(path)
        return self.get_instance_from_module(module)


def _load_module(path):
    import imp
    return imp.load_source(path, path)


if __name__ == "__main__":
    # TODO Enable execution of a pipeline with some default source?
    raise Exception("This module should not be executed.")
