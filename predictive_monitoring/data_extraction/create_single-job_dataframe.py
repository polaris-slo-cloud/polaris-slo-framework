import glob
import json
import os
import sys

import dask.dataframe as dd
import pandas as pd
from dask.delayed import delayed

job_id = int(sys.argv[1])
# Instantiate paths
input_path = sys.argv[2]
output_path = sys.argv[3]

def load_data(files):
    readings_df = []
    for f in files:
        readings_df.append(pd.read_csv(f, index_col=0))
    data = pd.concat(readings_df)
    return data




# Load data
files_type = 'task-usage_job-ID-%i*' % job_id
files_list = glob.glob(os.path.join(input_path, files_type))
readings_task_usage_df = load_data(files_list)
# Import schema
df_schema = pd.read_csv(os.path.join(data_paths['Google']['original_data'], 'schema.csv'))

task_events_files = [
    os.path.join(data_paths['Google']['original_data'], 'task_events/part-00' + str(v).zfill(3) + '-of-00500.csv.gz')
    for v in range(500)]
cols_task_events = df_schema[df_schema['file pattern'] == 'task_events/part-?????-of-?????.csv.gz'].content.values

dfs_task_events = [delayed(pd.read_csv)(fn, header=None, index_col=False, names=cols_task_events, delimiter=',') for fn
                   in
                   task_events_files]
readings_task_events_df = dd.from_delayed(dfs_task_events)
readings_task_events_df = readings_task_events_df[readings_task_events_df['job ID'] == job_id].dropna(
    subset=["CPU request", "memory request"]).compute()  # other ID 3418339
print(readings_task_events_df)

readings_task_usage_df['CPU ratio usage'] = readings_task_usage_df['CPU rate'] / \
                                            readings_task_events_df['CPU request'].values[0]
readings_task_usage_df['memory ratio usage'] = readings_task_usage_df['canonical memory usage'] / \
                                               readings_task_events_df['memory request'].values[0]
readings_task_usage_df['disk ratio usage'] = readings_task_usage_df['local disk space usage'] / \
                                             readings_task_events_df['disk space request'].values[0]

readings_task_usage_df['Efficiency'] = readings_task_usage_df[
    ['CPU ratio usage', 'memory ratio usage', 'disk ratio usage']].mean(axis=1)

csv_path = os.path.join(output_path, 'task-usage_job-ID-%i_total.csv' % job_id)
readings_task_usage_df.to_csv(csv_path)
