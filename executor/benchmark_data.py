#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Can prepare benchmarking data as a input for workflow execution.
#

import os
import gzip
import json
import time
import logging
import plugin_api_utils

__license__ = "X11"

_TRAIN_ACTIVES_FILE_NAME = "benchmark-data-actives.sdf.gz"
_TRAIN_INACTIVES_FILE_NAME = "benchmark-data-inactives.sdf.gz"
_TEST_FILE_NAME = "benchmark-data-candidates.sdf.gz"


class BenchmarkDataSource(object):

    def prepare(self, group_reference, split_files):
        """
        :return: For each input splits_file path to directory with molecules.
        """
        molecule_directory = self.molecule_directory(group_reference)
        cache_directory = self.cache_directory(group_reference)
        return prepare(split_files, molecule_directory, cache_directory)

    @staticmethod
    def molecule_directory(group_reference):
        return os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "..", "data", "datasets",
            group_reference["dataset"],
            "molecules")

    @staticmethod
    def cache_directory(group_reference):
        return os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "..", "data", "cache", "benchmark",
            group_reference["dataset"],
            group_reference["selection"],
            group_reference["group"])

    @staticmethod
    def train_actives_file_name():
        return _TRAIN_ACTIVES_FILE_NAME

    @staticmethod
    def train_inactives_file_name():
        return _TRAIN_INACTIVES_FILE_NAME

    @staticmethod
    def test_set_file_name():
        return _TEST_FILE_NAME


def prepare(split_files, molecule_dir, output_dir):
    logging.info("Preparing benchmarking data ...")
    molecule_source = _MoleculeSource(molecule_dir)
    output_molecule_dirs = []
    for split_file in split_files:
        split_output_dir = _output_directory(split_file, output_dir)
        output_molecule_dirs.append(split_output_dir)
        if _is_data_ready(split_output_dir):
            logging.debug("Benchmarking data have already been prepared ...")
            continue
        elif _lock_split(split_output_dir):
            logging.debug("Preparing benchmarking data ...")
            split = _read_json(split_file)
            molecules = molecule_source.load_molecules_for_split(split)
            _write_molecule_files(split, molecules, split_output_dir)
            _unlock_split(split_output_dir)
            logging.debug("Preparing benchmarking data ... done")
        else:
            logging.debug("Waiting for others to prepare data  ...")
            while _is_being_prepared(split_output_dir):
                time.sleep(3)
                logging.debug("Waiting for others to prepare data  ... done")
    logging.info("Preparing benchmarking data ... done")
    return output_molecule_dirs


def _output_directory(split_file, output_dir):
    split_name = split_file_to_name(os.path.basename(split_file))
    return os.path.join(output_dir, split_name)


def split_file_to_name(split_file):
    return split_file[0:split_file.index(".")]


def _is_data_ready(split_dir):
    paths = [
        os.path.join(split_dir, BenchmarkDataSource.test_set_file_name()),
        os.path.join(split_dir, BenchmarkDataSource.train_actives_file_name()),
        os.path.join(split_dir, BenchmarkDataSource.train_inactives_file_name())
    ]
    for path in paths:
        if not os.path.exists(path):
            return False
    return not _is_being_prepared(split_dir)


def _is_being_prepared(split_dir):
    return os.path.exists(_lock_dir_path(split_dir))


def _lock_dir_path(split_dir):
    return os.path.join(split_dir, ".viset-lock")


def _lock_split(split_dir):
    try:
        os.makedirs(_lock_dir_path(split_dir))
        return True
    except OSError:
        return False


def _unlock_split(split_dir):
    os.removedirs(_lock_dir_path(split_dir))


def _read_json(path):
    if path.lower().endswith("gz"):
        with gzip.open(path, "rt") as input_stream:
            return json.load(input_stream)
    else:
        with open(path, "r") as input_stream:
            return json.load(input_stream)


def _write_molecule_files(split, molecules, output_dir):
    os.makedirs(output_dir, exist_ok=True)

    # TODO Made sdf.gz data file optional, enable use of smi.gz.

    _write_molecules(
        _select_molecules(molecules, split["data"]["test"]),
        os.path.join(output_dir, _TEST_FILE_NAME))

    _write_molecules(
        _select_molecules(molecules, split["data"]["train"]["decoys"]),
        os.path.join(output_dir, _TRAIN_ACTIVES_FILE_NAME))

    _write_molecules(
        _select_molecules(molecules, split["data"]["train"]["ligands"]),
        os.path.join(output_dir, _TRAIN_INACTIVES_FILE_NAME))


def _select_molecules(molecules, name_list):
    return [molecules[item["name"]] for item in name_list]


def _write_molecules(molecules, path):
    from rdkit import Chem
    import gzip
    #
    with gzip.open(path, "wt") as stream:
        writer = Chem.SDWriter(stream)
        for molecule in molecules:
            writer.write(molecule)
        writer.close()


class _MoleculeSource(object):

    def __init__(self, molecule_dir):
        self.cache = {}
        self.molecule_dir = molecule_dir
        self.supported_extensions = ["sdf", "sdf.gz", "smi", "smi.gz"]

    def load_molecules_for_split(self, split):
        molecules = {}
        for file_name in split["data"]["files"]:
            path = self._get_path(file_name)
            molecules.update(self._load_molecule(path))
        return molecules

    def _get_path(self, file_name):
        for extension in self.supported_extensions:
            path = os.path.join(self.molecule_dir, file_name + "." + extension)
            if os.path.exists(path):
                return path
        raise Exception("Missing benchmark data file: '"
                        + file_name + "' in '" + self.molecule_dir)

    def _load_molecule(self, path):
        if path not in self.cache.keys():
            molecules = plugin_api_utils.RdkitUtils.load_molecules(
                path, True, False)
            molecules_by_name = {}
            for mol in molecules:
                molecules_by_name[mol.GetProp("_Name")] = mol
            self.cache[path] = molecules_by_name
        return self.cache[path]


if __name__ == "__main__":
    raise Exception("This module should not executed.")
