import json

import requests

from util.context import Context


def handle(input_features, context: Context):
    predict_request = json.dumps({'instances': input_features.tolist()})
    response = requests.post(context.tfserving_config.url, data=predict_request)
    print(response.json())
    return response.json()
