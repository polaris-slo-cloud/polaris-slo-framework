#!/usr/bin/env python
import json
import logging
import os

from flask import Flask, request
from waitress import serve

from invocation import handler as invocation_handler
from preprocessing import handler as preprocessing_handler
from query import handler as query_handler
from query.prometheus import PrometheusClient
from util.config import Config
from util.context import Context, TfServingConfig
from util.request import Request

app = Flask(__name__)

log = logging.getLogger(__name__)

client = PrometheusClient.from_env()
config = Config.from_env()
tfserving_config = TfServingConfig.from_env()


@app.route('/', defaults={'path': ''}, methods=['GET', 'PUT', 'POST', 'PATCH', 'DELETE'])
@app.route('/<path:path>', methods=['GET', 'PUT', 'POST', 'PATCH', 'DELETE'])
def call_ai_model(path):
    # TODO figure out what needs to be sent
    body = request.get_data(as_text=True)
    if len(body) > 0:
        body = Request.from_json(body)
    log.info(f'Received request with body: {body}')

    ctx = Context(
        client=client,
        config=config,
        tfserving_config=tfserving_config,
        body=body
    )

    raw_input_features = query_handler.handle(ctx)
    log.debug(
        f'length of raw input features: {len(raw_input_features)}, \
        features queried: {list(raw_input_features.columns)}'
    )
    input_features = preprocessing_handler.handle(raw_input_features, ctx)
    inference_result = invocation_handler.handle(input_features, ctx)

    return inference_result


if __name__ == '__main__':
    logging.basicConfig(level=logging._nameToLevel[os.environ.get('LOG_LEVEL', 'DEBUG')])
    port = 5000
    serve(app, host='0.0.0.0', port=port)
