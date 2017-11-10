#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import imp
import typing

import methods_api as methods

__license__ = "X11"

TYPE_REPRESENTATION = "representation"

TYPE_SIMILARITY = "similarity"

TYPE_MODEL_SIMILARITY = "similarity"

TYPE_FUSION = "fusion"

_ENTRY_POINT_FILE_NAME = "lbvs-entry.py"


class MethodStorage(object):
    """
    Provide access to stored methods.
    """

    def __init__(self):
        self.metadata = []
        self.instances = {}

    def load_methods_from_directory(self, methods_directory):
        for path in self._generate_entry_files(methods_directory):
            self._load_and_add_method(path)

    def _load_and_add_method(self, path):
        module = self._load_module(path)
        instance = typing.cast(methods.MethodInterface, module.LbvsEntry())
        instance_name = instance.get_metadata()["id"]
        types = self._get_types(instance)
        self.metadata.append({"name": instance_name, "types": types})
        self.instances[instance_name] = instance

    @staticmethod
    def _get_types(instance):
        types = []
        if isinstance(instance, methods.RepresentationInterface):
            types.append(TYPE_REPRESENTATION)
        if isinstance(instance, methods.SimilarityInterface):
            types.append(TYPE_SIMILARITY)
        if isinstance(instance, methods.ModelBasedSimilarityInterface):
            types.append(TYPE_MODEL_SIMILARITY)
        if isinstance(instance, methods.FusionInterface):
            types.append(TYPE_FUSION)
        return types

    @staticmethod
    def _generate_entry_files(directory: str):
        for file in os.listdir(directory):
            path = directory + "/" + file
            if file == _ENTRY_POINT_FILE_NAME and os.path.isfile(path):
                yield path
            if os.path.isdir(path):
                for item in MethodStorage._generate_entry_files(path):
                    yield item

    @staticmethod
    def _load_module(path: str):
        return imp.load_source(path, path)

    def get_instance(self, name):
        return self.instances[name]

    def get_metadata(self):
        return self.metadata


def configure_instance(instance: methods.MethodInterface, configuration):
    instance.configure(configuration)


def execute_method_instance(instance: methods.MethodInterface, action, ports):
    _execute_action(action, instance, ports)


def _execute_action(action, instance, ports):
    if action == "representation":
        instance.create_representation(**ports)
    elif action == "similarity":
        instance.compute_similarity(**ports)
    elif action == "model_create":
        instance.create_model(**ports)
    elif action == "model_score":
        instance.create_model(**ports)
    elif action == "fusion":
        instance.fuse_data(**ports)
