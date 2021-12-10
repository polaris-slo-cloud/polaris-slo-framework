import json
import logging

import requests

from util.context import Context

logger = logging.getLogger(__name__)


def handle(input_features, context: Context):
    predict_request = json.dumps({'instances': input_features})
    response = requests.post(context.tfserving_config.url, data=predict_request)
    logger.debug(response.json())
    return response.json()
