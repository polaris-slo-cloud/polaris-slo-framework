from collections import defaultdict
from typing import Dict, List

import pandas as pd

from query.prometheus import PrometheusClient
from util.config import Config
from util.context import Context


def transform_prom_result_to_list(result: Dict) -> List[float]:
    if result['status'] != 'success':
        raise ValueError(f'Query was not successful, was: {result["status"]}')
    try:
        return result['data']['result'][0]['values']
    except IndexError:
        return []


def handle(ctx: Context):
    client: PrometheusClient = ctx.client
    cfg: Config = ctx.config
    data = defaultdict(list)
    for key, query in cfg.metrics.items():
        result = client.query(query)
        result_list = transform_prom_result_to_list(result)
        if len(result_list) == 0:
            raise ValueError(f'Result of query "{query}" could not be transformed to list: {result}j')
        values = list(map(lambda x: x[1], result_list))
        data[key].extend(values)
    return pd.DataFrame(data)