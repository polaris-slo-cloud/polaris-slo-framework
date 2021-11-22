from dataclasses import dataclass

from query.prometheus import PrometheusClient
from util.config import Config


@dataclass
class Context:
    client: PrometheusClient
    config: Config
    body: str
