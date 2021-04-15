# High-level predictive monitoring with LSTM

This repository contains the code to generate an LSTM model for high-level monitoring prediction or to execute an already trained one.
The data folder contains pre-filtered and pre-processed data from [Google Cluster Data - 2011-2](https://github.com/google/cluster-data/blob/master/ClusterData2011_2.md).

The folder models contains the pre-trained LSTMs. To test it, you can run the test: `python gcd_test_model.py 6318371744`; the second argument represents the ID of the job to consider. The Jupyter notebook `test_gcd-model_predictions.ipynb` offers the possibility to explore different ways to test new data.

To re-train the LSTM, it is possible to run the script `gcd_single-job_multivariate_prediction.py [epochs neurons batch_size] --exp-name [exp]`. To reproduce the exact same model, the code is:`gcd_single-job_multivariate_prediction.py 400 50 72 --exp_name exp_01`.

