import csv
import logging
import time
from typing import List
from prometheus_client import Gauge, Histogram

logger = logging.getLogger(__name__)


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


class CsvMetrics:
    """
    Iterates over the given csv files over and over again.
    """

    def __init__(self, csv_files: List[str], reconcile_interval=5):
        self.reconcile_interval = reconcile_interval
        self.metrics = []
        self.csv_readers = [CsvReader(csv_file) for csv_file in csv_files]
        self.prepare_columns()

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
            row = next(csv_reader.read())
            for col, prom_obj in self.metrics:
                index = csv_reader.headers.index(col)
                try:
                    value = float(row[index])
                except ValueError as e:
                    logger.error(e)
                    value = 0

                if type(prom_obj) is Gauge:
                    prom_obj.labels(target_gvk="sloTarget", target_namespace="sloTargetNamespace",
                                    metric_prop_key="objPropKey") \
                        .set(value)
                elif type(prom_obj) is Histogram:
                    prom_obj.labels(target_gvk="sloTarget", target_namespace="sloTargetNamespace",
                                    metric_prop_key="objPropKey") \
                        .observe(value)
                else:
                    logging.error(f'Unknown prometheus object type: {type(prom_obj)}')

    def prepare_columns(self):
        labelnames = ['target_namespace', 'target_gvk', 'metric_prop_key']
        prefix = 'polaris_composed'
        self.metrics = [
            ('CPU rate', Gauge(f'{prefix}_cpu_rate', 'CPU rate', labelnames=labelnames)),
            ('canonical memory usage',
             Gauge(f'{prefix}_canonical_memory_usage', 'canonical memory usage', labelnames=labelnames)),
            ('assigned memory usage',
             Gauge(f'{prefix}_assigned_memory_usage', 'assigned memory usage', labelnames=labelnames)),
            ('unmapped page cache',
             Gauge(f'{prefix}_unmapped_page_cache', 'unmapped page cache', labelnames=labelnames)),
            ('total page cache', Gauge(f'{prefix}_total_page_cache', 'total page cache', labelnames=labelnames)),
            ('maximum memory usage',
             Gauge(f'{prefix}_maximum_memory_usage', 'maximum memory usage', labelnames=labelnames)),
            ('disk I/O time', Gauge(f'{prefix}_disk_io_time', 'disk I/O time', labelnames=labelnames)),
            ('local disk space usage',
             Gauge(f'{prefix}_local_disk_space_usage', 'local disk space usage', labelnames=labelnames)),
            ('maximum CPU rate', Gauge(f'{prefix}_maximum_cpu_rate', 'maximum CPU rate', labelnames=labelnames)),
            ('maximum disk IO time',
             Gauge(f'{prefix}_maximum_disk_io_time', 'maximum disk IO time', labelnames=labelnames)),
            ('cycles per instruction',
             Gauge(f'{prefix}_cycles_per_instruction', 'cycles per instruction', labelnames=labelnames)),
            ('memory accesses per instruction',
             Gauge(f'{prefix}_memory_accesses_per_instruction', 'memory accesses per instruction',
                       labelnames=labelnames)),
            ('CPU ratio usage', Gauge(f'{prefix}_cpu_ratio_usage', 'CPU ratio usage', labelnames=labelnames)),
            ('memory ratio usage', Gauge(f'{prefix}_memory_ratio_usage', 'memory ratio usage', labelnames=labelnames)),
            ('disk ratio usage', Gauge(f'{prefix}_disk_ratio_usage', 'disk ratio usage', labelnames=labelnames)),
        ]
