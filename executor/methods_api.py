#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Provides interface and storage class for LBVS methods.
"""

import abc

__license__ = "X11"

# TODO Merge into a single interface.

class MethodInterface(object):
    __metaclass__ = abc.ABCMeta

    def __init__(self):
        # By default we use empty object.
        self.configuration = {}

    @abc.abstractmethod
    def get_metadata(self) -> object:
        """
        Retrieve instance metadata.
        """
        raise NotImplementedError("Please implement this method.")

    def configure(self, configuration: object):
        """
        Set configuration.
        """
        self.configuration = configuration


class RepresentationInterface(MethodInterface):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def create_representation(self,
                              database_file: str,
                              output_file: str):
        """
        Compute representation of given molecules.
        """
        raise NotImplementedError("Please implement this method.")


class SimilarityInterface(MethodInterface):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def compute_similarity(self,
                           query_file: str,
                           database_file: str,
                           output_file: str):
        """
        Compute pair-wise similarity between left and right.
        """
        raise NotImplementedError("Please implement this method.")


class ModelBasedSimilarityInterface(MethodInterface):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def create_model(self,
                     actives_file: str,
                     inactives_file: str,
                     output_file: str):
        """
        Create model.
        """
        raise NotImplementedError("Please implement this method.")

    @abc.abstractmethod
    def score(self,
              database_file: str,
              model_file: str,
              output_file: str):
        """
        Score molecules using the model.
        """
        raise NotImplementedError("Please implement this method.")


class FusionInterface(MethodInterface):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def fuse_data(self,
                  similarity_file: str,
                  output_file: str):
        """
        Perform similarity fusion.
        """
        raise NotImplementedError("Please implement this method.")


if __name__ == "__main__":
    raise Exception("This module should not be executed.")
