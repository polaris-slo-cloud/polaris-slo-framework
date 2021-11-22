import json
import os
from dataclasses import dataclass
from typing import Dict

from dataclasses_json import dataclass_json


@dataclass_json
@dataclass
class Config:
    metrics: Dict[str, str]

    @classmethod
    def from_env(cls):
        config_file = os.getenv('CONFIG_FILE', 'data/config.json')
        if config_file is None:
            raise ValueError()
        else:
            with open(config_file, 'r') as fd:
                return Config.from_dict(json.load(fd))
