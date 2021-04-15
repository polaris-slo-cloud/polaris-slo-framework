import sys
from math import sqrt

from gcd_data_manipulation import data_aggregation
from gcd_data_manipulation import load_data
from gcd_data_manipulation import series_to_supervised
from matplotlib import pyplot
from numpy import concatenate
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import MinMaxScaler
from tensorflow import keras

job_id = int(sys.argv[1])
name = "LSTM_on_test_workload_%i" % job_id


def predict_model(test_X, test_y, model):
    # make a prediction
    yhat = model.predict(test_X, batch_size=72)
    test_X = test_X.reshape((test_X.shape[0], test_X.shape[2]))
    # invert scaling for forecast
    inv_yhat = concatenate((test_X[:, :-1], yhat), axis=1)

    inv_yhat = scaler.inverse_transform(inv_yhat)
    inv_yhat = inv_yhat[:, -1]
    # invert scaling for actual
    test_y = test_y.reshape((len(test_y), 1))
    inv_y = concatenate((test_X[:, :-1], test_y), axis=1)
    inv_y = scaler.inverse_transform(inv_y)
    inv_y = inv_y[:, -1]

    return inv_y, inv_yhat


columns_to_consider = ['end time',
                       'CPU rate',
                       'canonical memory usage',
                       'assigned memory usage',
                       'unmapped page cache',
                       'total page cache',
                       'maximum memory usage',
                       'disk I/O time',
                       'local disk space usage',
                       'maximum CPU rate',
                       'maximum disk IO time',
                       'cycles per instruction',
                       'memory accesses per instruction',
                       'CPU ratio usage',
                       'memory ratio usage',
                       'disk ratio usage',
                       'Efficiency'  # target metric
                       ]

readings_df = load_data('data/task-usage_job-ID-%i_total.csv' % job_id, columns_to_consider)
readings_df = data_aggregation(readings_df, aggr_type='mean')

values = readings_df.values

values = values.astype('float32')
# normalize features
scaler = MinMaxScaler(feature_range=(0, 1))
scaled = scaler.fit_transform(values)

# frame as supervised learning
reframed = series_to_supervised(scaled, 1, 1)
# drop columns we don't want to predict
reframed.drop(reframed.columns[[i for i in range(int(reframed.shape[1] / 2), (2 * int(reframed.shape[1] / 2)) - 1)]],
              axis=1,
              inplace=True)

# split into train and test sets
values = reframed.values

test_X, test_y = values[:, :-1], values[:, -1]

test_X = test_X.reshape((test_X.shape[0], 1, test_X.shape[1]))

model = keras.models.load_model('results/lstm_batch72_neurons50_epochs400_do0')

print(model.summary())

inv_y, inv_yhat = predict_model(test_X, test_y, model)


def plot_prediction(y, yhat, name):
    # line plot of observed vs predicted
    pyplot.clf()
    pyplot.plot(y[-100:], '-', color='orange', label="Raw measurements")
    pyplot.plot(yhat[-100:], '--', color='blue', label="Predictions")
    pyplot.xlabel('Steps', fontsize=20)
    pyplot.ylabel('Efficiency', fontsize=20)
    pyplot.xticks(fontsize=24)
    pyplot.yticks(fontsize=24)
    pyplot.legend(fontsize=14, frameon=False)
    pyplot.tight_layout()
    prediction_out_figure = 'figures/gcd_%s_pred.png' % name
    pyplot.savefig(prediction_out_figure)


plot_prediction(inv_y, inv_yhat, name)
rmse = sqrt(mean_squared_error(inv_y, inv_yhat))

with open('results/%s.log' % name, 'w') as f:
    f.write("RMSE: %f" % rmse)