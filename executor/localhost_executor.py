#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Executor for pipeline execution on local instance.
"""

import json
import logging
import os
import typing

from plugin_api import PluginSourceInterface

__license__ = "X11"


class LocalhostExecutor(object):
    """
    Pipeline executor.

    Input paths must be relative to the working directory!
    """

    def __init__(self):
        self.directory = None
        self.input_directories = None
        self.plugin_source = None
        self.port_mapping = {}

    def set_plugin_storage(self, plugin_source: PluginSourceInterface):
        self.plugin_source = plugin_source

    def set_port_mapping(self, port_mapping):
        """
        Port mapping can be used to mart port by types.
        """
        self.port_mapping = port_mapping

    def execute(
            self,
            definition_file: str,
            working_dir: str,
            input_dir: typing.List[str]):
        self._initialize_directories(working_dir, input_dir)
        self._load_pipeline(definition_file)
        self._create_directories()
        self._execute_components()
        # TODO Perform cleanup

    def _initialize_directories(self, working_dir, input_dir):
        self.directory = os.path.abspath(working_dir)
        self.input_directories = [self._expand_relative_path(directory)
                                  for directory in input_dir]

    def _expand_relative_path(self, path):
        return os.path.join(self.directory, path)

    def _load_pipeline(self, definition_file):
        with open(definition_file, "r") as stream:
            content = json.load(stream)
        self.pipeline = content["workflow"]

    def _create_directories(self):
        os.makedirs(self._get_working_path(), exist_ok=True)
        os.makedirs(self._get_output_path(), exist_ok=True)

    def _get_working_path(self):
        return os.path.join(self.directory, "working")

    def _get_output_path(self):
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
            port = ports[port_id]
            port = self._check_port_mapping(port)
            file_name = port["file"]
            if port["dir"] == "input":
                output[port_id] = self._resolve_port_path(file_name)
            else:
                path = os.path.join(port["dir"], file_name)
                output[port_id] = self._expand_relative_path(path)
        return output

    def _check_port_mapping(self, port):
        if "type" in port and port["type"] in self.port_mapping:
                return self.port_mapping[port["type"]]
        return port

    def _resolve_port_path(self, path):
        for directory in self.input_directories:
            candidate_path = os.path.join(directory, path)
            if os.path.isfile(candidate_path):
                return candidate_path
        logging.info("Input directories: %s", str(self.input_directories))
        raise Exception("Missing input file: " + path)
