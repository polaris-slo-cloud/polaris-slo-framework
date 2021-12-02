from invocation import tfserving
from util.context import Context


def handle(input_features, context: Context):
    # TODO invoke AI model/service with input features
    return tfserving.handle(input_features, context)
