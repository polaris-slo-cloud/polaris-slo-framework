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
        host = os.getenv('PROMETHEUS_HOST', 'localhost')
        port = os.getenv('PROMETHEUS_PORT', '30900')
        url = f'{host}:{port}'
        return PrometheusClient(url)
