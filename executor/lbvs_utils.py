#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Utility module visible to plugins.
"""

__license__ = "X11"


class RdkitUtils(object):
    """
    Shared utilities for working with RDKit.
    """

    @staticmethod
    def load_molecules(path, sanitize=True, ignore_invalid_files=False):
        """
        Load molecules from given file.

        :param path:
        :param sanitize:
        :param ignore_invalid_files:
        :return: Array of RDKit molecules.
        """
        if not isinstance(path, list):
            path = [path]
        molecules = []
        for item in path:
            loaded_molecules = RdkitUtils._load_molecules_file(
                item, sanitize, ignore_invalid_files)
            molecules.extend(loaded_molecules)
        return molecules

    @staticmethod
    def _load_molecules_file(path, sanitize, ignore_invalid_files):
        if path.endswith(".sdf"):
            return RdkitUtils._load_molecules_sdf(path, sanitize)
        elif path.endswith(".sdf.gz"):
            return RdkitUtils._load_molecules_sdf_gz(path, sanitize)
        elif path.endswith(".smi"):
            return RdkitUtils._load_molecules_smi(path, sanitize)
        else:
            if not ignore_invalid_files:
                raise Exception("Invalid file: " + path)
            else:
                return []

    @staticmethod
    def _load_molecules_sdf(path, sanitize):
        from rdkit import Chem
        #
        return [mol for mol in Chem.SDMolSupplier(path, sanitize=sanitize)
                if mol is not None]

    @staticmethod
    def _load_molecules_sdf_gz(path, sanitize):
        from rdkit import Chem
        import gzip
        #
        with gzip.open(path, "rb") as stream:
            return [mol for mol in
                    Chem.ForwardSDMolSupplier(stream, sanitize=sanitize)
                    if mol is not None]

    @staticmethod
    def _load_molecules_smi(path, sanitize):
        from rdkit.Chem import AllChem
        #
        molecules = []
        with open(path) as stream:
            for line in stream:
                molecules.append(AllChem.MolFromSmiles(line, sanitize=sanitize))
        return molecules
