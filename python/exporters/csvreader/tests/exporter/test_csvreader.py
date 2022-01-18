import unittest

from exporter.csvreader import CsvReader


class CsvReaderTest(unittest.TestCase):

    def setUp(self) -> None:
        file = '../../data/test.csv'
        self.reader = CsvReader(file)

    def tearDown(self) -> None:
        self.reader.close()

    def test_headers(self):
        headers = ['id', 'cpu', 'ram']
        self.assertEqual(self.reader.headers, headers)

    def test_reader(self):
        results = [['0', '0.5', '399'], ['1', '0.4', '033']]

        reads = []
        read = next(self.reader.read())
        reads.append(read)

        read = next(self.reader.read())
        reads.append(read)

        self.assertEqual(results, reads)
