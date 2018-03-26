#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Evaluate results of a benchmark execution.
"""

import os
import json
import gzip
import functools

__license__ = "X11"


def evaluate_benchmark(group_directory, scores_file):
    group = _read_group_file(group_directory)
    actives = [item["name"] for item in group["data"]["ligands"]]
    inactives = [item["name"] for item in group["data"]["decoys"]]

    scores = _read_json_file(scores_file)
    _add_activity(scores, actives, inactives)
    _write_json_file(scores_file, scores)

    sorted_items = _sort_by_values(scores["data"])
    measures = _evaluate_rdkit_measures(sorted_items)
    return measures


def _read_group_file(group_directory):
    # TODO Create utils file to enable support of zip formats automatically
    group_file = os.path.join(group_directory, "group.json")
    if os.path.exists(group_file):
        with open(group_file, "r") as group_stream:
            return json.load(group_stream)
    else:
        group_file += ".gz"
        with gzip.open(group_file, "rt") as group_stream:
            return json.load(group_stream)


def _read_json_file(path):
    with open(path, "r") as group_stream:
        return json.load(group_stream)


def _add_activity(scores, actives, inactives):
    for item in scores["data"]:
        if item["id"] in actives:
            item["activity"] = 1
        elif item["id"] in inactives:
            item["activity"] = 0
        else:
            raise Exception("Missing activity record for : " + item["id"])


def _sort_by_values(items):
    return sorted(items,
                  key=functools.cmp_to_key(_score_compare_worst),
                  reverse=True)


def _score_compare_worst(left, right):
    if left["value"] > right["value"]:
        return 1
    elif left["value"] < right["value"]:
        return -1
    # They have the same score, we put inactive first. So if all molecule
    # get the same value, the actives will be at the end.
    if left["activity"] and right["activity"]:
        return 0
    elif left["activity"]:
        return -1
    else:
        return 1


def _write_json_file(path, content):
    with open(path, "w") as group_stream:
        return json.dump(content, group_stream)


def _evaluate_rdkit_measures(items):
    from rdkit.ML.Scoring import Scoring
    enrichment = Scoring.CalcEnrichment(items, "activity", [0.05, 0.01])
    # TODO Add more measures
    # Scoring.CalcBEDROC(items, 'activity', 20)
    # Scoring.CalcRIE()
    return {
        "auc": Scoring.CalcAUC(items, "activity"),
        "ef": {
            "0.05": enrichment[0],
            "0.01": enrichment[0],
        }
    }
