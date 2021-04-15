import pandas as pd
import numpy as np
import os
import glob
import sys

import dask.dataframe as dd
from dask.delayed import delayed


INCREMENT=50

output_path = 
job_id = int(sys.argv[1])
start_index = int(sys.argv[2])
data_path = sys.argv[3]
output_path = sys.argv[4]

print("job ID: %i | range: 00%s-00%s" % (job_id, str(start_index).zfill(3), str(start_index+INCREMENT-1).zfill(3)))


# Import schema
df_schema = pd.read_csv(os.path.join(data_path, 'schema.csv'))

# Extract data
cols_tu = df_schema[df_schema['file pattern'] == 'task_usage/part-?????-of-?????.csv.gz'].content.values
task_usage_files = [os.path.join(data_path, 'task_usage','part-00'+ str(v).zfill(3)+'-of-00500.csv.gz')
                        for v in range(start_index, start_index+INCREMENT)]

dfs_tu = [delayed(pd.read_csv)(fn, header=None, index_col=False, names=cols_tu, delimiter=',') for fn in
           task_usage_files]
readings_tu_df = dd.from_delayed(dfs_tu)
readings_tu_df = readings_tu_df[readings_tu_df['job ID'] == job_id]

csv_path = os.path.join(output_path, 'task-usage_job-ID-%i_00%s-to-00%s.csv' % 
    (job_id, str(start_index).zfill(3), str(start_index+INCREMENT-1).zfill(3)))
readings_tu_df.to_csv(csv_path, single_file = True)