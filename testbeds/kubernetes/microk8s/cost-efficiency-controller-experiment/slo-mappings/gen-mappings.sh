#!/bin/bash

templateYamlFile=("$1")
totalCount=100

allSloMappings=""

for i in $(seq 1 $totalCount); do
    sloMapping=$(sed -e "s/{{ \.Name }}/gentics-mesh-cost-efficiency-${i}/" ${templateYamlFile})
    allSloMappings=$(echo -e "${allSloMappings}\n${sloMapping}")
done

echo "$allSloMappings"
