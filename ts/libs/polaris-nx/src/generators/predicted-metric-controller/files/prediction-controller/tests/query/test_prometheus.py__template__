import unittest

from query.prometheus import PrometheusClient


class PrometheusTest(unittest.TestCase):
    """
    This test currently requires a running real life Prometheus instance
    """

    def setUp(self) -> None:
        base_url = 'localhost:30900'
        self.client = PrometheusClient(base_url)

    def test_query(self):
        query = 'container_cpu_cfs_periods_total'
        result = self.client.query(query)
        self.assertTrue(type(result) is dict, f'Result type is {type(result)}')
