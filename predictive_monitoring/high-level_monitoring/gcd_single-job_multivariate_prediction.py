import argparse
import os
import sys
from collections import defaultdict
from math import sqrt
import json

from gcd_data_manipulation import data_aggregation
from gcd_data_manipulation import extract_train_test
from gcd_data_manipulation import load_data
from keras.layers import Dense
from keras.layers import LSTM
from keras.models import Sequential
from matplotlib import pyplot
from numpy import concatenate
from pandas import DataFrame
from sklearn.metrics import mean_squared_error


class Range(object):
    def __init__(self, start, end):
        self.start = start
        self.end = end

    def __eq__(self, other):
        return self.start <= other <= self.end

    def __contains__(self, item):
        return self.__eq__(item)

    def __iter__(self):
        yield self

    def __repr__(self):
        return '[{0},{1}]'.format(self.start, self.end)




def generate_model(train_x, batch_size, neurons, stateful):
    model = Sequential()
    if stateful:
        model.add(LSTM(neurons, batch_input_shape=(batch_size, train_x.shape[1], train_x.shape[2]),
                       stateful=True, dropout=dropout))
    else:
        model.add(
            LSTM(neurons,
                 input_shape=(train_x.shape[1], train_x.shape[2]),
                 dropout=dropout))
    model.add(Dense(1))
    model.compile(loss='mae', optimizer='adam')
    return model


def fit_model(train_X, train_y, test_X, test_y, model, epochs, batch_size, stateful):
    # fit network
    history_loss = defaultdict(list)
    if stateful:
        for i in range(epochs):
            print('epoch %i/%i' % (i + 1, epochs))
            model.fit(train_X, train_y, epochs=1, batch_size=batch_size,
                      validation_data=(test_X, test_y), verbose=2, shuffle=False)
            history_loss['loss'].append(model.history.history['loss'])
            history_loss['val_loss'].append(model.history.history['val_loss'])
            model.reset_states()
    else:
        history = model.fit(train_X, train_y, epochs=epochs, batch_size=batch_size,
                            validation_data=(test_X, test_y), verbose=2, shuffle=False)
        history_loss = history.history

    return history_loss


def predict_model(test_X, test_y, model):
    # make a prediction
    yhat = model.predict(test_X, batch_size=batch_size)
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


def plot_val_history(history, output_path, name):
    # plot history
    pyplot.clf()
    pyplot.plot(history['loss'], label='train')
    pyplot.plot(history['val_loss'], label='test')
    pyplot.legend()
    pyplot.ylim((0.00, 0.27))
    pyplot.savefig(os.path.join(output_path, 'gcd_%s_val-loss.png' % name))


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
    prediction_out_figure = os.path.join(figures_path, 'gcd_%s_pred.png' % name)
    pyplot.savefig(prediction_out_figure)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Predict efficiency for a job. Source data: Google-cluster-data-2011')
    parser.add_argument('hyperparameters', metavar='H', type=int, nargs=3,
                        help='epochs neurons batch_size')
    parser.add_argument("--exp_name", type=str, required=True,
                        help="Name of the experiment. Necessary to save results")
    parser.add_argument("--cols", type=str, required=True,
                       help="Name of the column selection as reported in the json file columns_selection.json")
    parser.add_argument("--dropout", type=float, default=0.0, choices=Range(0.0, 1.0), dest="dropout",
                        help="dropout to reduce overfitting. Default = 0.0")
    parser.add_argument("--aggr_type", type=str, default="mean", choices=["mean", "q95", "max"], dest='aggr_type',
                        help="Aggregation to perform on the dataset. Default = 'mean'")
    parser.add_argument("--n_rep", type=int, default=1, dest="n_rep",
                        help="Defines the number of repetition. Default = 1")
    parser.add_argument("--stateful", action="store_true",
                        help="If stateful, keeps the LSTM memory between batches")
    parser.add_argument("--job_id", type=int, default=3418339, dest='job_id'
                        help="ID of the job considered for the model generation.")


    with open('columns_selectin.json') as f:
        columns_selection = json.load(f)
    
    args = parser.parse_args(sys.argv[1:])
    epochs, neurons, batch_size = args.hyperparameters
    exp_name = args.exp_name
    cols = args.cols
    dropout = args.dropout
    aggr_type = args.aggr_type
    n_rep = args.n_rep
    stateful = args.stateful
    JOB_ID = args.job_id

    input_path = "data/task-usage_job-ID-%i_total.csv" % JOB_ID
    figures_path = 'figures'
    results_path = 'results'

    columns_to_consider = columns_selection[cols]

    # Data manipulation
    readings_df = load_data(input_path, columns_to_consider)
    readings_df = data_aggregation(readings_df, aggr_type=aggr_type)

    results = defaultdict(list)
    for r in range(n_rep):
        train_X, train_y, test_X, test_y, scaler = extract_train_test(readings_df.values)
        stateful_string = ''
        if stateful:
            stateful_string = '-stateful'

        model = generate_model(train_X, batch_size, neurons, stateful=stateful)

        history_loss = fit_model(train_X, train_y, test_X, test_y, model, epochs, batch_size, stateful=stateful)

        inv_y, inv_yhat = predict_model(test_X, test_y, model)

        # calculate RMSE
        rmse = sqrt(mean_squared_error(inv_y, inv_yhat))
        print('Test RMSE: %.3f' % rmse)
        results['experiment'].append(exp_name)
        results['neurons'].append(neurons)
        results['batch_size'].append(batch_size)
        results['epochs'].append(epochs)
        results['dropout'].append(dropout)
        results['stateful'].append(stateful)
        results['aggregation'].append(aggr_type)
        results['rmse'].append(rmse)

    res = DataFrame(results)
    res.to_csv(os.path.join(results_path, '%s.csv' % exp_name))
    plot_val_history(history_loss, figures_path, exp_name)
    plot_prediction(inv_y, inv_yhat, exp_name)
    model.save(
        "models/lstm_model_%s" % exp_name)
