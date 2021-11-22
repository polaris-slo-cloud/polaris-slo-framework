import os
from typing import Dict

import requests


class PrometheusClient:

    def __init__(self, base_url: str):
        self.base_url = base_url

    def query(self, query: str) -> Dict:
        url = f'http://{self.base_url}/api/v1/query?query={query}'
        return requests.get(url).json()

    @classmethod
    def from_env(cls) -> 'PrometheusClient':
        base_url = os.getenv('PROMETHEUS_URL', 'localhost:30900')
        return PrometheusClient(base_url)
