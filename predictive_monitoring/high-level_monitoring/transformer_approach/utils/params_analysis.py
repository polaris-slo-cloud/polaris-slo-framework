import pandas as pd
import json
from os import walk


if __name__ == '__main__':

    results_path = "/data/results/vcpujol/transformers/single_deployment/google_traces/model_params_best/"
    test_data_path = "/data/results/vcpujol/transformers/single_deployment/google_traces/model_params_best/test_loss.json"
    with open(test_data_path) as jfile:
        test_values = json.load(jfile)

    folders_list = []
    for _, dirnames, _ in walk(results_path):
        folders_list.extend(dirnames)
        break

    all_results = dict()
    for folder in folders_list:
        exp_path = results_path + folder

        with open(exp_path + "/params.json") as jfile:
            all_results[folder] = json.load(jfile)
            all_results[folder]['test_loss'] = test_values[folder]


    df = pd.DataFrame(all_results)
    df.drop(labels=["prediction_step", "input_feat_enc", "input_feat_dec", "lr", "lr_step", "epochs", "seq_len", "gamma", "batch_size"], axis=0, inplace=True)
    df.sort_values(by="test_loss", axis=1, inplace=True)
    df.to_csv(results_path + "model_params.csv")
    print(df)

