from torch.utils.data import Dataset
from torch import tensor
import pandas as pd
import numpy as np


class LoadGoogleDataset(Dataset):
    """
    Returns a batch_size times a sequence of len seq_len
    :param
    is_train: Default True. If False it uses test data
    bs: Batch size for training
    w_step: Sliding window step
    prediction_steps: Lookahead training, default 1
    """

    def __init__(self, mode="train", seq_len=1, prediction_step=1, data_frame=None):
        self.mode = mode
        self.seq_len = int(seq_len)
        self.p_steps = int(prediction_step)

        times = sorted(data_frame.index.values)
        last_20pct = sorted(data_frame.index.values)[-int(0.2 * len(times))]  # Last 20% of series
        last_40pct = sorted(data_frame.index.values)[-int(0.4 * len(times))]  # Last 40% of series

        if mode == "train":
            self.data_set = data_frame[(data_frame.index < last_40pct)]  # Training data are 80% of total data
        elif mode == "validation":
            self.data_set = data_frame[(data_frame.index >= last_40pct) & (data_frame.index < last_20pct)]
        elif mode == "test":
            self.data_set = data_frame[(data_frame.index >= last_20pct)]

        if self.seq_len > len(self.data_set) - self.p_steps:
            self.seq_len = len(self.data_set) - self.p_steps - 1

    def __len__(self):
        return len(self.data_set) - (self.seq_len + self.p_steps) + 1

    def __getitem__(self, idx):
        if self.mode == 'test':
            start = idx
            end = idx + self.seq_len
            input_idx = range(start, end)
            target_idx = range(end, end + self.p_steps)
        else:
            ind = np.random.randint(0, len(self.data_set) - (self.seq_len + self.p_steps), 1, dtype=int)
            start = int(ind)
            end = int(start + self.seq_len)
            input_idx = range(start, end)
            target_idx = range(end, end + self.p_steps)

        return tensor(self.data_set.iloc[input_idx, :-1].values), tensor(self.data_set.iloc[input_idx, -1].values), \
               tensor(self.data_set.iloc[target_idx, -1].values)
