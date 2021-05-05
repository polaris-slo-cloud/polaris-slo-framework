import pandas as pd


if __name__ == '__main__':

    results_path = "/data/results/vcpujol/transformers/single_deployment/google_traces/params.json"
    df = pd.read_json(results_path)
    df.drop(labels=["prediction_step", "input_feat_enc", "input_feat_dec"], axis=0, inplace=True)
    df.sort_values(by="loss", axis=1, inplace=True)
    print(df)

