from transformer_train import *
import torch
from ray import tune
from ray.tune import CLIReporter
from ray.tune.schedulers import ASHAScheduler
from functools import partial
from transformer_train import *
import os


def asha_training(exp_name, num_samples=500, max_num_epochs=30, gpus_per_trial=1, cpus_per_trial=10):
    data_path = "../data/task-usage_job-ID-3418339_total.csv"
    columns_file = "../columns_selection.json"
    columns_scheme = "LSTM_efficiency_1"
    cuda_id = 1

    df = prepare_data(data_path, columns_file, columns_scheme)

    os.environ["CUDA_VISIBLE_DEVICES"] = "1,2,3"
    # torch.cuda.set_device("cuda:1")
    # device = select_device(cuda_id)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    # print("device = " + str(device))

    experiment_name = exp_name
    save_dir = '/data/results/vcpujol/transformers/single_deployment/google_traces/'
    check_point_dir = save_dir + "checkpoints/"

    print(device)

    config = {
        "random_seed": tune.randint(1, 10000),
        "lr": tune.choice([0.01]),
        "lr_step": tune.choice([2]),
        "gamma": tune.choice([0.99]),
        "epochs": tune.choice([30]),
        "n_heads": tune.randint(2, 16),
        "dim_val": tune.choice([2, 4, 6, 8, 10, 12, 14, 16, 18]),  # FIXME requires numero parell...
        "dim_att": tune.randint(2, 20),
        "encoder_layers": tune.randint(1, 10),
        "decoder_layers": tune.randint(1, 10),
        "batch_size": tune.choice([4]),
        "input_feat_enc": tune.choice([15]),
        "input_feat_dec": tune.choice([1]),
        "seq_len": tune.choice([64]),
        # [16, 32, 64, 128, 256, 512, 1024, 2048]
        "prediction_step": tune.choice([1])
    }

    scheduler = ASHAScheduler(
        metric="loss",
        mode="min",
        max_t=max_num_epochs,
        grace_period=5,
        reduction_factor=2)
    reporter = CLIReporter(
        parameter_columns=["n_heads", "dim_val", "dim_att", "encoder_layers",
                           "decoder_layers"],
        metric_columns=["loss", "training_iteration"])
    result = tune.run(
        partial(transformer_train, df=df, device=device),
        resources_per_trial={"cpu": cpus_per_trial, "gpu": gpus_per_trial},
        config=config,
        num_samples=num_samples,
        scheduler=scheduler,
        progress_reporter=reporter,
        local_dir=save_dir,
        name=experiment_name)

    best_trial = result.get_best_trial("loss", "min", "last")
    print("Best trial config: {}".format(best_trial.config))
    print("Best trial final validation loss: {}".format(best_trial.last_result["loss"]))
    # print("Best trial final validation accuracy: {}".format(best_trial.last_result["accuracy"]))

    best_trained_model = init_transformer(best_trial.config, device)
    best_checkpoint_dir = best_trial.checkpoint.value
    model_state, optimizer_state = torch.load(os.path.join(
        best_checkpoint_dir, "checkpoint"))
    best_trained_model.load_state_dict(model_state)

    local_dir = save_dir
    exp_name = experiment_name
    test_acc = transformer_test(best_trained_model, df, device, best_trial.config, local_dir, exp_name)
    print("Best trial test set accuracy: {}".format(test_acc))


if __name__ == '__main__':

    print(torch.__version__)

    # Training, validation and test of the best model for the ASHA scheduler.
    exp_name = None
    if len(sys.argv) != 2:
        print("Provide experiment name")
        exit(1)
    else:
        exp_name = sys.argv[1]
        asha_training(exp_name)

    # For debugging purposes.
    # data_path = "../data/task-usage_job-ID-3418339_total.csv"
    # columns_file = "../columns_selection.json"
    # columns_scheme = "LSTM_efficiency_1"
    # cuda_id = 1
    # df = prepare_data(data_path, columns_file, columns_scheme)
    # #
    # os.environ["CUDA_VISIBLE_DEVICES"] = "1"
    # device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    # #
    # config = dummy_config()
    # #
    # transformer_train(config, df, device)
