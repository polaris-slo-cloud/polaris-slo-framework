from transformer_train import init_transformer, prepare_data
from data_loader import LoadGoogleDataset
from torch.utils.data import DataLoader
import json
import torch

if __name__ == '__main__':
    # Set paths to data
    data_path = "../data/task-usage_job-ID-3418339_total.csv"
    # Select columns from dataset
    columns_file = "../columns_selection.json"
    columns_scheme = "LSTM_efficiency_1"
    # Prepare dataset
    df = prepare_data(data_path, columns_file, columns_scheme)
    # Set up a device
    device = 'cpu'
    # Load the model configuration
    with open("models/config.json") as jfile:
        config = json.load(jfile)

    # Initialize the model
    model = init_transformer(config, device)
    # Load the model
    model_state, _ = torch.load("models/model_data", map_location=device)
    model.load_state_dict(model_state)
    model.eval()
    # Select a loss function
    loss_f = torch.nn.MSELoss()
    # Prepare test dataset
    test_dataset = LoadGoogleDataset("test", seq_len=config["seq_len"], prediction_step=config["prediction_step"],
                                     data_frame=df)
    test_loader = DataLoader(test_dataset, batch_size=1, shuffle=False)

    # Run test/forecast loop
    loss_progress = list()
    for x_enc, x_dec, target in test_loader:
        with torch.no_grad():
            # Send data to device and prepare dimensions
            x_enc, x_dec, target = x_enc.to(device), x_dec.to(device), target.to(device)
            x_dec = x_dec.unsqueeze(-1)
            # Forecast
            out = model.forward(x_enc.float(), x_dec.float(), training=False)
            # Compute loss
            loss = loss_f(out.double(), target.double())
            # Keep loss values in a list
            loss_progress.append(loss.cpu().detach().tolist())

    mean_loss = sum(loss_progress) / len(loss_progress)
    print("Mean loss at test: " + str(mean_loss))
