#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Download datasets.
#
"""
Download data used in the platform.
This script is compatible with Python 2.7 and 3,5+.

Usage example:
    python download_data.py
"""

from __future__ import print_function

import argparse
import json
import os
import zipfile

__license__ = "X11"

BASE_URL = "http://siret.ms.mff.cuni.cz/skoda/vs-datasets/"

_DATA_DIR = os.path.dirname(os.path.realpath(__file__)) + "/../../data/"


def main():
    args = parse_argument()
    dataset_id = args["dataset"]
    dataset = get_dataset_from_index(dataset_id)
    if dataset is None:
        print("Missing dataset:", dataset_id)
        return
    download_dataset(dataset)


def parse_argument():
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", dest="dataset", help="Datasets ID.")
    return vars(parser.parse_args())


def get_dataset_from_index(dataset_id):
    index = load_index()
    for dataset in index["datasets"]:
        if dataset["id"] == dataset_id:
            return dataset
    return None


def load_index():
    path = os.path.join(_DATA_DIR, "datasets.json")
    with open(path, "r") as input_stream:
        return json.load(input_stream)


def download_dataset(dataset):
    # Download molecules.
    url = BASE_URL + dataset["id"] + "/molecules/sdf.zip"
    path = dataset_molecule_dir(dataset["id"])
    download_and_unpack(url, path, dataset["id"])

    # Download selections.
    path = dataset_selection_dir(dataset["id"])
    for selection_id in dataset["selections"]:
        url = dataset_selection_url(dataset["id"], selection_id["id"])
        download_and_unpack(url, path, dataset["id"] + "_" + selection_id["id"])


def dataset_molecule_dir(dataset_id):
    return _DATA_DIR + "/datasets/" + dataset_id + "/molecules/"


def dataset_selection_dir(dataset_id):
    return _DATA_DIR + "/datasets/" + dataset_id + "/selections/"


def dataset_selection_url(dataset_id, selection_id):
    return BASE_URL + dataset_id + "/selections/" + selection_id + ".zip"


def download_and_unpack(url, target_path, id):
    """Download file from given URI and unpack it to given directory.

    :param url:
    :param target_path:
    :param id:
    :return:
    """
    # Prepare output and temp directory.
    temp_file_path = os.path.join(_DATA_DIR, "temp", "download", id + ".zip")
    create_directory(target_path)
    create_directory(os.path.dirname(temp_file_path))
    # Print info.
    print("URL:", url)
    print(" ->", target_path)
    # Download.
    print(" Downloading ", end="")
    response = open_connection(url)
    with open(temp_file_path, "wb") as output_stream:
        total_size = int(response.headers["Content-Length"])
        # Download with progress bar.
        step_size = total_size / 20.0
        next_step = step_size
        position = 0
        for content in response:
            position += len(content)
            output_stream.write(content)
            if position > next_step:
                next_step += step_size
                print(".", end="")
    print(" done\n Unzipping ... ", end="")
    with zipfile.ZipFile(temp_file_path) as zip_file:
        zip_file.extractall(target_path)
    os.remove(temp_file_path)
    print("done")


def create_directory(path):
    if os.path.exists(path):
        return
    os.makedirs(path)


def open_connection(url):
    import platform
    major_version = platform.python_version_tuple()[0]
    if major_version == '2':
        import urllib
        return urllib.urlopen(url)
    else:
        from urllib import request
        return request.urlopen(url)


if __name__ == "__main__":
    main()
