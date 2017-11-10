#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
from operator import itemgetter

import methods_api

__license__ = "X11"


class LbvsEntry(methods_api.FusionInterface):
    """
    Perform group max fusion.
    """

    def fuse_data(self, database_file: str, output_file: str):
        with open(database_file, "r") as stream:
            data = json.load(stream)

        fused_data = LbvsEntry._fuse_data(data)

        with open(output_file, "w") as stream:
            json.dump({"data": fused_data}, stream)

    @staticmethod
    def _fuse_data(data):
        best_sim = {}
        for item in data["data"]:
            if item["id"] in best_sim:
                current_value = best_sim[item["id"]]["value"]
                if current_value < item["value"]:
                    # TODO Extract as a function
                    best_sim[item["id"]] = {
                        "id": item["id"],
                        "query": item["query"],
                        "value": item["value"]
                    }
            else:
                best_sim[item["id"]] = {
                    "id": item["id"],
                    "query": item["query"],
                    "value": item["value"]
                }

        # Sort.
        values = sorted(best_sim.values(),
                        key=itemgetter("value"),
                        reverse=True)

        # Add order attribute.
        for index in range(0, len(values)):
            values[index]["order"] = index + 1

        return values

    def get_metadata(self) -> object:
        return {
            "id": "max-fusion"
        }
