from dataclasses import dataclass

from dataclasses_json import dataclass_json


@dataclass_json
@dataclass
class Request:
    target_gvk: str
    target_namespace: str
    target_name: str
