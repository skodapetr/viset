#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
from rdkit import DataStructs
import plugin_api

__license__ = "X11"


class LbvsEntry(plugin_api.PluginInterface):
    """
    Compute Tanimoto similarity.
    """

    def __init__(self):
        self.stream = None
        self.counter = 0
        self.first_entry = False

    def execute(self, files):
        query = LbvsEntry._load_file(files["query_file"])
        database = LbvsEntry._load_file(files["database_file"])
        with open(files["output_file"], "w") as stream:
            self.stream = stream
            self.write_output_header()
            self.compute_and_write_similarities_for_items(query, database)
            self.write_output_footer()

    def write_output_header(self):
        self.stream.write('{"data":[')

    def write_output_footer(self):
        self.stream.write(']}')

    def compute_and_write_similarities_for_items(self, query, database):
        self.first_entry = True
        for query_item in query:
            for database_item in database:
                self._write_separator_if_needed()
                self.first_entry = False
                self._compute_and_write_similarity(query_item, database_item)

    def _write_separator_if_needed(self):
        if not self.first_entry:
            self.stream.write(",")

    def _compute_and_write_similarity(self, query, item):
        similarity = LbvsEntry._compute_similarity(
            query["value"], item["value"])
        json.dump({
            "query": query["id"],
            "id": item["id"],
            "value": similarity
        }, self.stream)

    @staticmethod
    def _load_file(path):
        with open(path) as stream:
            return [{
                        "id": item["id"],
                        "value": LbvsEntry._as_sparse_vector(item["value"])
                    } for item in json.load(stream)["data"]]

    @staticmethod
    def _as_sparse_vector(data):
        # Use max integer value as a size.
        vector = DataStructs.cDataStructs.IntSparseIntVect(8388608)
        for key in data:
            vector[(int)(key)] = (int)(data[key])
        return vector

    @staticmethod
    def _compute_similarity(left, right):
        return DataStructs.TanimotoSimilarity(left, right)

    def get_metadata(self) -> object:
        return {
            "id": "rdkit/tanimoto"
        }
