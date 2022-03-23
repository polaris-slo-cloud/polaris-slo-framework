#!/bin/bash
# set -x
set -o errexit

# Delete old builds.
rm -rf ./dist
rm -rf ./tmp


# Build the projects.
PROJECTS=(
    "core"
    "common-mappings"
    "kubernetes"
    "query-backends-prometheus"
    "metrics-cost-efficiency"
    "schema-gen"
    "polaris-nx"
    "cli-polaris-cli"
    "elasticity-horizontal-elasticity-strategy-controller"
    "elasticity-vertical-elasticity-strategy-controller"
    "metrics-rest-api-cost-efficiency-controller"
    "slo-cost-efficiency-slo-controller"
    "slo-cpu-usage-slo-controller"
    "ui-polaris-ui"
)

for proj in ${PROJECTS[@]}; do
    npx nx build $proj
done


echo "All packages were successfully built."
