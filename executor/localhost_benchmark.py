#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Modified executor with support for benchmarking, this includes:
* Support for datasets preparation
* Support for
"""

import os
import json

import localhost_executor
import benchmark_evaluation

__license__ = "X11"


class LocalhostBenchmark(object):

    def __init__(self):
        self.definition_file = None
        self.working_dir = None
        self.input_dirs = None
        self.molecule_source = None
        self.benchmark_file = None
        self.benchmark_definition = None
        self.plugin_source = None
        self.runs_counts = 0
        self.runs = []
        self.dataset_directory = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "..", "data", "datasets")

    def set_definition_file(self, definition_file):
        self.definition_file = definition_file

    def set_working_dir(self, working_dir):
        self.working_dir = working_dir

    def set_input_dirs(self, input_dirs):
        self.input_dirs = input_dirs

    def set_benchmark_file(self, benchmark_file):
        self.benchmark_file = benchmark_file

    def set_plugin_source(self, plugin_source):
        self.plugin_source = plugin_source

    def set_molecule_source(self, molecule_source):
        self.molecule_source = molecule_source

    def execute(self):
        self._load_benchmark_definition()
        for group_reference in self._group_references():
            group_dir = self._group_directory(group_reference)
            splits = self._list_split_files(group_dir)
            data_paths = self._prepare_benchmark_data(group_reference, splits)
            for (split, data_path) in zip(splits, data_paths):
                self._benchmark_split(group_reference, split, data_path)
        self.create_summary_file()

    def _load_benchmark_definition(self):
        with open(self.benchmark_file, "r") as input_stream:
            self.benchmark_definition = json.load(input_stream)

    def _group_references(self):
        return self.benchmark_definition["benchmark"]

    def _group_directory(self, group_reference):
        return os.path.join(
            self.dataset_directory,
            group_reference["dataset"],
            "selections",
            group_reference["selection"],
            group_reference["group"]
        )

    def _list_split_files(self, directory):
        return [{
            "path": os.path.join(directory, file_name),
            "name": self.split_file_to_name(file_name)
        } for file_name in os.listdir(directory) if file_name.startswith("s_")]

    @staticmethod
    def split_file_to_name(path):
        return path[0:path.index(".")]

    def _prepare_benchmark_data(self, group_reference, splits):
        splits_files = [item["path"] for item in splits]
        return self.molecule_source.prepare(group_reference, splits_files)

    def _benchmark_split(self, group_reference, split, data_path):
        inputs = [data_path] + self.input_dirs
        run_info = self._create_directory_for_run(group_reference, split)
        run_directory = os.path.join(self.working_dir, run_info["dir_name"])

        executor = localhost_executor.LocalhostExecutor()
        executor.set_plugin_storage(self.plugin_source)
        executor.set_port_mapping(self._port_mapping())
        executor.execute(self.definition_file, run_directory, inputs)

        # TODO Read 'scores.json' from the method definition.
        scores_file_path = os.path.join(run_directory, "output", "scores.json")
        evaluation = self._evaluate_split(group_reference, scores_file_path)
        run_info["evaluation"] = evaluation
        # self._add_to_summary_evaluation(run_info, evaluation)

    def _create_directory_for_run(self, group_reference, split):
        self.runs_counts += 1
        run_info = {
            "dir_name": "run-" + str(self.runs_counts).zfill(3),
            "split": split["name"],
            "dataset": group_reference["dataset"],
            "selection": group_reference["selection"],
            "group": group_reference["group"]
        }
        self.runs.append(run_info)
        return run_info

    def _port_mapping(self):
        return {
            "train-actives": {
                "file": self.molecule_source.train_actives_file_name(),
                "dir": "input"
            },
            "train-inactives": {
                "file": self.molecule_source.train_inactives_file_name(),
                "dir": "input"
            },
            "test": {
                "file": self.molecule_source.test_set_file_name(),
                "dir": "input"
            }
        }

    def create_summary_file(self):
        definition = self._load_definition_file()
        with open(self._summary_file(), "w") as summary_stream:
            json.dump({
                "runs": self.runs,
                "type": "benchmark",
                "files": definition["user_interface"]
            }, summary_stream, indent=2)

    def _load_definition_file(self):
        with open(self.definition_file, "r") as input_stream:
            return json.load(input_stream)

    def _summary_file(self):
        return os.path.join(self.working_dir, "summary.json")

    def _evaluate_split(self, group_reference, scores_file_path):
        return benchmark_evaluation.evaluate_benchmark(
            self._group_directory(group_reference), scores_file_path)

    # def _add_to_summary_evaluation(self, run_info, evaluation):
    #     file_path = os.path.join(self.working_dir, "evaluation.json")
    #     content = self._read_json_if_exists(file_path, [])
    #     content.append({
    #         "dataset" : run_info["dataset"],
    #         "group": run_info["group"],
    #         "selection": run_info["selection"],
    #         "split": run_info["split"],
    #         "run" :run_info["dir_name"],
    #         "data" : evaluation
    #     })
    #     with open(file_path, "w") as output_steam:
    #         json.dump(content, output_steam, indent=2)

    # @staticmethod
    # def _read_json_if_exists(path, default):
    #     if not os.path.exists(path):
    #         return default
    #     with open(path, "r") as input_stream:
    #         return json.load(input_stream)

        # benchmark_output_file = os.path.join(
        #     working_path, "evaluation.json")
        # with open(benchmark_output_file, "w") as output_stream:
        #     json.dump({"measures": evaluation}, output_stream, indent=2)
