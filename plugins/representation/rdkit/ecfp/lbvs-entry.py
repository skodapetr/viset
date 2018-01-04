#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
from rdkit.Chem import AllChem
import plugin_api
from plugin_api_utils import RdkitUtils


__license__ = "X11"


class LbvsEntry(plugin_api.PluginInterface):
    """
    Compute RDKit extended-connectivity-fingerprints.

    Mandatory configuration:
    * radius
    Optional configuration:
    * nBits
    """

    def execute(self, files):
        self._update_configuration()
        reps = []
        for molecule in RdkitUtils.load_molecules(files["database_file"]):
            reps.append({
                "id": molecule.GetProp("_Name"),
                "value": self._compute_representation(molecule)
            })
        with open(files["output_file"], "w") as stream:
            json.dump({
                "data": reps
            }, stream)

    def _update_configuration(self):
        self.configuration["useFeatures"] = False

    def _compute_representation(self, molecule):
        fp = AllChem.GetMorganFingerprintAsBitVect(
            molecule, **self.configuration)
        representation = {}
        for index in fp.GetOnBits():
            representation[index] = 1
        return representation

    def get_metadata(self) -> object:
        return {
            "id": "rdkit/ecfp"
        }
