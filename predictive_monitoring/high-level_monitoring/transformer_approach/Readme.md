Data series forecasting using a transformer.

Follow the example.py in the folder to see a very simple usage of the model

## Prepare the data for the model
```Python
# Set paths to data
data_path = "../data/task-usage_job-ID-3418339_total.csv"
# Select columns from dataset
columns_file = "../columns_selection.json"
columns_scheme = "LSTM_efficiency_1"
# Prepare dataset
df = prepare_data(data_path, columns_file, columns_scheme)
```

## Set up a device
```Python
# Considering using cuda if available.
device = 'cpu'
```

## Load and prepare the model 
```Python
# Load the model configuration
with open("models/config.json") as jfile:
    config = json.load(jfile)
# Initialize the model
model = init_transformer(config, device)
# Load the model
model_state, _ = torch.load("models/model_data", map_location=device)
model.load_state_dict(model_state)
# Set the model for evaluation mode
model.eval()
```

## Select the loss function.
```Python
# This model has been trained with MSE, but others can be considered.
loss_f = torch.nn.MSELoss()
```

## Convert dataset to pytorch dataloader functions
```Python
# Notice that the first argument is "test". Using "train" or "validation" will provide access to other parts of the data. However, they will also feed the model with other data structures not as a sliding window as in test.
test_dataset = LoadGoogleDataset("test", seq_len=config["seq_len"], prediction_step=config["prediction_step"],
                                 data_frame=df)
test_loader = DataLoader(test_dataset, batch_size=1, shuffle=False)
```

## Run test/forecast loop
```Python
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
```

Transfomer model adapted from: 

Wu, N., Green, B., Ben, X., & O’Banion, S. (2020). Deep Transformer Models for Time Series Forecasting: The Influenza Prevalence Case. ArXiv. http://arxiv.org/abs/2001.08317

![Transformer model](https://raw.githubusercontent.com/vikcas/figures/main/transformer_model.png?token=ACPGCP7MYUVZO66AIOAFLZDAX6FYU)
