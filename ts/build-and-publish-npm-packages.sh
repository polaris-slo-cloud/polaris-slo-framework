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
    "prometheus"
    "cost-efficiency"
    "schema-gen"
    "polaris-nx"
    "polaris-cli"
)

for proj in ${PROJECTS[@]}; do
    npx nx build $proj
done


# Publish the npm packages.
NPM_PKGS=(
    "./libs/core"
    "./libs/common-mappings"
    "./libs/kubernetes"
    "./libs/prometheus"
    "./libs/cost-efficiency"
    "./libs/schema-gen"
    "./libs/polaris-nx"
    "./apps/polaris-cli"
)

cd ./dist
for pkg in ${NPM_PKGS[@]}; do
    npm publish $pkg
done

echo "All packages published successfully."
