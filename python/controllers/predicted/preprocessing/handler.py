from typing import Dict

import pandas as pd

from preprocessing.lstm import lstm_handle
from util.context import Context


def handle(raw_input_features: pd.DataFrame, ctx: Context):
    return lstm_handle(raw_input_features)
