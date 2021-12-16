import json
import os
from dataclasses import dataclass
from typing import Dict, List

from dataclasses_json import dataclass_json


@dataclass_json
@dataclass
class Config:
    # metrics catalogue, maps names to Prometheus keys
    metrics: Dict[str, str]

    # contains a list of metric names that will be used as key for the metrics dict
    requested_metrics: List[str]

    @classmethod
    def from_env(cls):
        config_file = os.getenv('METRICS_FILE', 'data/metrics.json')
        requested_metrics_file = os.getenv('REQUESTED_METRICS_FILE', 'data/request.json')
        if config_file is None:
            raise ValueError()
        elif requested_metrics_file is None:
            raise ValueError()
        else:
            with open(config_file, 'r') as fd:
                metrics = json.load(fd)

            with open(requested_metrics_file, 'r') as fd:
                requested = json.load(fd)
            return Config(metrics=metrics, requested_metrics=requested)
