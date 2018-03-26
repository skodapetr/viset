#!/usr/bin/env python
# -*- coding: utf-8 -*-
import unittest

from plugin_api_utils import RdkitUtils

__license__ = "X11"

TEST_DIRECTORY = "./tests/executor/rdkit/"


class TestMoleculeLoading(unittest.TestCase):
    def test_load_sdf(self):
        molecules = RdkitUtils.load_molecules(
            TEST_DIRECTORY + "/two_molecules.sdf")
        self.assertEqual(2, len(molecules))

    def test_load_sdf_gz(self):
        molecules = RdkitUtils.load_molecules(
            TEST_DIRECTORY + "/two_molecules.sdf.gz")
        self.assertEqual(2, len(molecules))

    def test_load_smiles(self):
        molecules = RdkitUtils.load_molecules(
            TEST_DIRECTORY + "/two_molecules.smi")
        self.assertEqual(2, len(molecules))

    def test_invalid_file(self):
        self.assertRaises(Exception, RdkitUtils.load_molecules,
                          TEST_DIRECTORY + "/missing_file")

    def test_invalid_file_with_ignore_invalid_option(self):
        molecules = RdkitUtils.load_molecules(
            TEST_DIRECTORY + "/missing_file",
            ignore_invalid_files=True)
        self.assertEqual(0, len(molecules))


if __name__ == '__main__':
    unittest.main()
