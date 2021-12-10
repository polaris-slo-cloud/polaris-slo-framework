import logging
from collections import defaultdict
from typing import Dict, List

import pandas as pd

from query.prometheus import PrometheusClient
from util.config import Config
from util.context import Context

logger = logging.getLogger(__name__)


def transform_prom_result_to_list(result: Dict) -> List[float]:
    if result['status'] != 'success':
        raise ValueError(f'Query was not successful, was: {result["status"]}')
    try:
        return result['data']['result'][0]['values']
    except IndexError:
        return []


def handle(ctx: Context):
    """
    Reads the requested metrics and maps them to Prometheus keys.
    Additionally, the Prometheus keys have placeholders to insert labels - which are based on the Request.
    Returns a DataFrame that contains the data fetched from Prometheus.
    """
    client: PrometheusClient = ctx.client
    cfg: Config = ctx.config
    data = defaultdict(list)
    for key in cfg.requested_metrics:
        query = cfg.metrics.get(key, None)
        if query is None:
            raise ValueError(f'Unknown metric "{key}"')
        # TODO remove demo prefix!
        query = query % ("{" + f'target_gvk="{ctx.body.target_gvk}", target_namespace="demo-{ctx.body.target_namespace}"' + "}")
        logger.debug(f'Send following query to Prometheus: "{query}"')
        result = client.query(query)
        result_list = transform_prom_result_to_list(result)
        if len(result_list) == 0:
            raise ValueError(f'Result of query "{query}" could not be transformed to list: {result}j')
        values = list(map(lambda x: x[1], result_list))
        data[key].extend(values)
    return pd.DataFrame(data)
