from invocation import tfserving


def handle(input_features, request_body):
    # TODO invoke AI model/service with input features
    return tfserving.handle(input_features)
