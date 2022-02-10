Data series forecasting using a transformer.

Follow the example.py in the folder to see a very simple usage of the model

## Prepare the data for the model
```Python
# Set paths to data
data_path = "../data/task-usage_job-ID-3418339_total.csv"
results_path = "..."
results_file = "...csv"
# Prepare dataset
df, scaler = prepare_data(data_path)
```

## Set up a device
```Python
# Considering using cuda if available.
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
```

## Load and prepare the model

```Python
# Load the model configuration
with open("models/multistep/config.json") as jfile:
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
if config["prediction_step"] > 1:
    outputs = dict()
    targets = dict()
    for ii in range(config["prediction_step"]):
        outputs[str(ii)] = list()
        targets[str(ii)] = list()
else:
    outputs = list()
    targets = list()
for x_enc, x_dec, target in test_loader:
    with torch.no_grad():
        # Send data to device and prepare dimensions
        x_enc, x_dec, target = x_enc.to(device), x_dec.to(device), target.to(device)
        x_dec = x_dec.unsqueeze(-1)
        # Forecast
        out = model.forward(x_enc.float(), x_dec.float(), training=False)
        # Compute loss
        loss = loss_f(out.double(), target.double())
        # Store results and target values
        if config["prediction_step"] > 1:
            for ii in range(config["prediction_step"]):
                outputs[str(ii)].append(out.squeeze().cpu().detach().tolist()[ii])
                targets[str(ii)].append(target.squeeze().cpu().detach().tolist()[ii])
        else:
            outputs.append(out.squeeze().cpu().detach().tolist())
            targets.append(target.squeeze().cpu().detach().tolist())
        # Keep loss values in a list
        loss_progress.append(loss.cpu().detach().tolist())
```
        
## Re-scale data
```Python
# re-scale outputs
l_df = len(df["Efficiency"])
df_computed = df

values = dict()

if config["prediction_step"] > 1:
    eff_out = dict()
    tgt_out = dict()
    for ii in range(config["prediction_step"]):
        real_eff = np.zeros(len(df["Efficiency"]))
        real_eff[l_df - len(outputs[str(ii)]):] = outputs[str(ii)]
        df_computed["Efficiency"] = real_eff
        df_unscaled = scaler.inverse_transform(df_computed)
        eff_out[str(ii)] = df_unscaled[l_df - len(outputs[str(ii)]):, -1]

        real_eff = np.zeros(len(df["Efficiency"]))
        real_eff[l_df - len(outputs[str(ii)]):] = targets[str(ii)]
        df_computed["Efficiency"] = real_eff
        df_unscaled = scaler.inverse_transform(df_computed)
        tgt_out[str(ii)] = df_unscaled[l_df - len(outputs[str(ii)]):, -1]

        values["eff_" + str(ii)] = eff_out[str(ii)].tolist()
        values["tgt_" + str(ii)] = tgt_out[str(ii)].tolist()

else:
    real_eff = np.zeros(len(df["Efficiency"]))
    real_eff[l_df - len(outputs):] = outputs
    df_computed["Efficiency"] = real_eff
    df_unscaled = scaler.inverse_transform(df_computed)
    eff_out = df_unscaled[l_df - len(outputs):, -1]

    real_eff = np.zeros(len(df["Efficiency"]))
    real_eff[l_df - len(outputs):] = targets
    df_computed["Efficiency"] = real_eff
    df_unscaled = scaler.inverse_transform(df_computed)
    tgt_out = df_unscaled[l_df - len(outputs):, -1]

    values["eff"] = eff_out.tolist()
    values["tgt"] = tgt_out.tolist()
```

## Save data
```Python
with open(results_path + results_file, 'w') as f:
    dict_writer = writer(f)
    dict_writer.writerow(values.keys())
    dict_writer.writerows(zip(*values.values()))
```

Transfomer model adapted from: 

Wu, N., Green, B., Ben, X., & O’Banion, S. (2020). Deep Transformer Models for Time Series Forecasting: The Influenza Prevalence Case. ArXiv. http://arxiv.org/abs/2001.08317

![Transformer model](https://raw.githubusercontent.com/vikcas/figures/main/transformer_model.png?token=ACPGCP7MYUVZO66AIOAFLZDAX6FYU)
