#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
from rdkit.Chem import MACCSkeys
import methods_api
import lbvs_utils

__license__ = "X11"


class LbvsEntry(methods_api.RepresentationInterface):
    """
    Compute RDKit extended-connectivity-fingerprints.
    """

    def create_representation(self, database_file: str, output_file: str):
        reps = []
        for molecule in lbvs_utils.RdkitUtils.load_molecules(database_file):
            reps.append({
                "id": molecule.GetProp("_Name"),
                "value": self._compute_representation(molecule)
            })
        with open(output_file, "w") as stream:
            json.dump({
                "data": reps
            }, stream)

    def _compute_representation(self, molecule):
        fp = MACCSkeys.GenMACCSKeys(molecule)
        representation = {}
        for index in fp.GetOnBits():
            representation[index] = 1
        return representation

    def get_metadata(self) -> object:
        return {
            "id": "rdkit/maccs"
        }
