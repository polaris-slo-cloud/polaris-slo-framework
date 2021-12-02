import os
from dataclasses import dataclass

from query.prometheus import PrometheusClient
from util.config import Config


@dataclass
class TfServingConfig:
    url: str

    @staticmethod
    def from_env():
        url = os.getenv('TFSERVING_URL', None)
        if url is None:
            url = 'localhost:8500'
        return TfServingConfig(url)

@dataclass
class Context:
    client: PrometheusClient
    config: Config
    tfserving_config: TfServingConfig
    body: str
