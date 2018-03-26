#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
This module is part of plugin API.

Do not use module method directly!
"""

import gzip

__license__ = "X11"


# TODO Add option to NOT-ignore invalid molecules

class RdkitUtils(object):
    """
    RDKit based utilities.
    """

    @staticmethod
    def load_molecules(path, sanitize=True, ignore_invalid_files=False):
        """
        Load molecules from given file.

        :param path: Can be a list.
        :param sanitize:
        :param ignore_invalid_files:
        :return: Array of RDKit molecules.
        """
        if not isinstance(path, list):
            path = [path]
        molecules = []
        for item in path:
            loaded_molecules = _load_molecules_file(
                item, sanitize, ignore_invalid_files)
            molecules.extend(loaded_molecules)
        return molecules


def _load_molecules_file(path, sanitize, ignore_invalid_files):
    if path.endswith(".sdf"):
        return _load_molecules_sdf(path, sanitize)
    elif path.endswith(".sdf.gz"):
        return _load_molecules_sdf_gz(path, sanitize)
    elif path.endswith(".smi"):
        return _load_molecules_smi(path, sanitize)
    elif path.endswith(".smi.gz"):
        return _load_molecules_smi_gz(path, sanitize)
    else:
        if not ignore_invalid_files:
            raise Exception("Invalid file: " + path)
        else:
            return []


def _load_molecules_sdf(path, sanitize):
    from rdkit import Chem
    #
    return [mol for mol in Chem.SDMolSupplier(path, sanitize=sanitize)
            if mol is not None]


def _load_molecules_sdf_gz(path, sanitize):
    from rdkit import Chem
    #
    with gzip.open(path, "rb") as stream:
        return [mol for mol in
                Chem.ForwardSDMolSupplier(stream, sanitize=sanitize)
                if mol is not None]


def _load_molecules_smi(path, sanitize):
    with open(path) as stream:
        return _parse_smi_stream(stream, sanitize)


def _parse_smi_stream(stream, sanitize):
    from rdkit.Chem import AllChem
    #
    molecules = []
    for line in stream:
        smiles, name = _parse_smiles_file_line(line)
        molecule = AllChem.MolFromSmiles(smiles, sanitize=sanitize)
        if molecule is None:
            continue
        molecule.SetProp("_Name", name)
        molecules.append(molecule)
    return molecules


def _parse_smiles_file_line(line):
    line = line.strip().split("\t")
    if len(line) == 1:
        return line[0], line[0]
    else:
        return line[0], line[1]


def _load_molecules_smi_gz(path, sanitize):
    with gzip.open(path, "rb") as stream:
        return _parse_smi_stream(stream, sanitize)
