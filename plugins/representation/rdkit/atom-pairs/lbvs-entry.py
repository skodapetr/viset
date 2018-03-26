#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
from rdkit import Chem
from rdkit.Chem.AtomPairs import Pairs
import plugin_api
from plugin_api_utils import RdkitUtils

__license__ = "X11"


class LbvsEntry(plugin_api.PluginInterface):
    """
    Computes RDKit atom-pairs fingerprints.
    """

    def execute(self, files):
        reps = []
        for molecule in RdkitUtils.load_molecules(files["database_file"]):
            reps.append({
                "id": molecule.GetProp("_Name"),
                "value": self._compute_representation(molecule)
            })
        with open(files["output_file"], "w") as stream:
            json.dump({"data": reps}, stream)

    def _compute_representation(self, molecule):
        fp = Pairs.GetAtomPairFingerprint(molecule, **self.configuration)
        representation = {}
        for index in fp.GetNonzeroElements():
            representation[index] = 1
        return representation

    def get_metadata(self) -> object:
        return {
            "id": "rdkit/atom-pairs"
        }
