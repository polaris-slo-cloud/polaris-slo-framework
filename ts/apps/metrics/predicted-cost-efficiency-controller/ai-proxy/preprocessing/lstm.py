import pandas as pd
from sklearn.preprocessing import MinMaxScaler

from preprocessing.gcd_data_manipulation import data_aggregation, series_to_supervised


def lstm_handle(raw_input_features: pd.DataFrame):
    readings_df = data_aggregation(raw_input_features, aggr_type='mean')

    values = readings_df.values

    values = values.astype('float32')
    # normalize features
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled = scaler.fit_transform(values)

    # frame as supervised learning
    reframed = series_to_supervised(scaled, 1, 1)

    # drop columns we don't want to predict
    reframed.drop(
        reframed.columns[[i for i in range(int(reframed.shape[1] / 2), (2 * int(reframed.shape[1] / 2)) - 1)]],
        axis=1,
        inplace=True)

    # split into train and test sets
    values = reframed.values

    test_X, test_y = values[:1, :-1], values[:, -1]

    return test_X.reshape((test_X.shape[0], 1, test_X.shape[1])).tolist()
