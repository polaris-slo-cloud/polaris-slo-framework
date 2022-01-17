import logging
import os
from prometheus_client import start_http_server

from exporter.csvreader import CsvMetrics

logger = logging.getLogger(__name__)


def main():
    logging.basicConfig(level=logging._nameToLevel[os.environ.get('LOG', 'DEBUG')])

    reconcile_interval = int(os.getenv("RECONCILE_INTERVAL", "5"))
    exporter_port = int(os.getenv("EXPORTER_PORT", "9877"))

    csv_files = ['data/demo.csv']
    csv_metrics = CsvMetrics(csv_files, reconcile_interval=reconcile_interval)
    start_http_server(exporter_port)
    csv_metrics.run_metrics_loop()


if __name__ == '__main__':
    main()
