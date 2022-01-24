from typing import Dict

import pandas as pd

from preprocessing.lstm import lstm_handle
from util.context import Context


def handle(raw_input_features: pd.DataFrame, ctx: Context):
    # TODO requires custom implementation for pre-processing of raw input features
    return lstm_handle(raw_input_features)
