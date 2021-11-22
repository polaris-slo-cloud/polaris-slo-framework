import csv
import time
from typing import List
from prometheus_client import Gauge


class CsvReader:
    """
    This class offers convenient reading of large csv files using Python's generators
    """

    def __init__(self, csv_file: str, delimiter=','):
        self.csv_file = csv_file
        self._csv_file = None
        self.datareader = None
        self._headers = []
        self.delimiter = delimiter
        self.init_file()

    def init_file(self):
        if self._csv_file is not None:
            self._csv_file.close()
        self._csv_file = open(self.csv_file, 'r')
        self.datareader = csv.reader(self._csv_file, delimiter=self.delimiter)
        self._headers = next(self.datareader)  # get the header row

    def read(self) -> List[str]:
        while True:
            for row in self.datareader:
                yield row
            self.init_file()

    def peek(self, n: int) -> List[List[str]]:
        """
        Opens the file and reads the specified number of rows
        :param n: how many rows should be read and returned
        :return: a list of rows
        """
        rows = []
        with open(self.csv_file, "r") as csvfile:
            datareader = csv.reader(csvfile, delimiter=self.delimiter)
            next(datareader)  # ignore the header
            for i in range(n):
                rows.append(next(datareader))

        return rows

    @property
    def headers(self) -> List[str]:
        """
        :return: the headers of the csv file
        """
        return self._headers

    def close(self):
        if self._csv_file is not None:
            self._csv_file.close()


def read_cpu_usage(row: List[str], index: int) -> float:
    return float(row[index])


class CsvMetrics:
    """
    Iterates over the given csv files over and over again.
    """

    def __init__(self, csv_files: List[str], reconcile_interval=5):
        self.reconcile_interval = reconcile_interval
        self.csv_readers = [CsvReader(csv_file) for csv_file in csv_files]
        labelnames = ['target_namespace', 'target_gvk', 'metric_prop_key']

        self.cpu_usage = Gauge("polaris_composed_cpu_usage", "CPU Usage", labelnames=labelnames)

    def run_metrics_loop(self):
        """Metrics fetching loop"""

        while True:
            self.fetch()
            time.sleep(self.reconcile_interval)

    def fetch(self):
        """
        Get metrics from application and refresh Prometheus metrics with
        new values.
        """

        for csv_reader in self.csv_readers:
            cpu_usage_index = csv_reader.headers.index('CPU ratio usage')
            row = next(csv_reader.read())
            cpu_usage = read_cpu_usage(row, cpu_usage_index)
            self.cpu_usage.labels(target_gvk="sloTarget", target_namespace="sloTargetNamespace",
                                  metric_prop_key="objPropKey") \
                .set(cpu_usage)
