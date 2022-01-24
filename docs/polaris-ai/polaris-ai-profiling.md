# Workload profiling

This code performs steps to generate precise and representative profile groups for workload, based on what we call static metadata.

Static metadata is all the information regarding the workload that doesn't change at runtime. Ideally, when users deploy some applications in the platform, they give information regarding the type of workload they intend to submit, details about the operating system, and the applications' priorities.
This data is essential to underline behavioral and design patterns for the users and their workload. However, this information is relevant in the measure that it characterizes specific workload execution schemes.

## Approach overview
Our approach follows a series of steps, given the premises mentioned beforehand, and starting from the assumption that the system doesn't have, initially, any profile label. Thus:
1. The first step is to perform unsupervised learning techniques to find similarities in workload execution. Here, we look at a few key features, namely:
    - CPU
    - Memory
    - Disk
    - Level of parallelization
    - Runtime length
2. Once the algorithm has extracted relevant groups, we can derive information regarding the static metadata, linking the workload to their static features and deducing patterns.
3. Finally, we create models of each of these profiles to let the system perform an automatic workload assignment to each group.
