#!/usr/bin/env python
import json
import logging

from flask import Flask, request
from waitress import serve

from invocation import handler as invocation_handler
from preprocessing import handler as preprocessing_handler
from query import handler as query_handler

app = Flask(__name__)

log = logging.getLogger(__name__)
# TODO how should config should look like
config = {
    # TODO insert prometheus query
    'cpu': '<prometheus query>'
}


@app.route('/', defaults={'path': ''}, methods=['GET', 'PUT', 'POST', 'PATCH', 'DELETE'])
@app.route('/<path:path>', methods=['GET', 'PUT', 'POST', 'PATCH', 'DELETE'])
def call_ai_model(path):
    # TODO figure out what needs to be sent
    body = request.get_data(as_text=True)
    if len(body) > 0:
        body = json.loads(body)
    log.info(f'Received request with body: {body}')

    raw_input_features = query_handler.handle(config, body)
    input_features = preprocessing_handler.handle(raw_input_features, body)
    inference_result = invocation_handler.handle(input_features, body)

    return {"result": inference_result}


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    port = 5000
    serve(app, host='0.0.0.0', port=port)
