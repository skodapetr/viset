#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json

from rdkit.Chem import rdMolDescriptors

import lbvs_utils
import methods_api

__license__ = "X11"


class LbvsEntry(methods_api.RepresentationInterface):
    """
    Compute RDKit extended-connectivity-fingerprints.

    Mandatory configuration:
    * nBits
    """

    def create_representation(self, database_file: str, output_file: str):
        self._update_configuration()
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

    def _update_configuration(self):
        self.configuration["useFeatures"] = True

    def _compute_representation(self, molecule):
        fp = rdMolDescriptors.GetHashedTopologicalTorsionFingerprintAsBitVect(
            molecule, self.configuration)
        representation = {}
        for index in fp.GetOnBits():
            representation[index] = 1
        return representation

    def get_metadata(self) -> object:
        return {
            "id": "rdkit/topological-torsion"
        }
