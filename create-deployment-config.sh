#!/bin/bash
set -x
set -o errexit

# ToDo: Add possibility to specify version, because currently the version must be manually set in th econtrollers' YAML files.

OUTPUT="deployment/1-elasticity-strategies.yaml"

# Delete old config.
rm -rf "$OUTPUT"


# Build the projects.
INPUT_YAML_FILES=(
    # CRDs
    "ts/crds/kubernetes/costefficiencymetricmappings.metrics.polaris-slo-cloud.github.io.yaml"
    "ts/crds/kubernetes/costefficiencyslomappings.slo.polaris-slo-cloud.github.io.yaml"
    "ts/crds/kubernetes/cpuusageslomappings.slo.polaris-slo-cloud.github.io.yaml"
    "ts/crds/kubernetes/horizontalelasticitystrategies.elasticity.polaris-slo-cloud.github.io.yaml"
    "ts/crds/kubernetes/verticalelasticitystrategies.elasticity.polaris-slo-cloud.github.io.yaml"

    # Horizontal Elasticity Strategy controller
    "ts/apps/elasticity/horizontal-elasticity-strategy-controller/manifests/1-rbac.yaml"
    "ts/apps/elasticity/horizontal-elasticity-strategy-controller/manifests/2-elasticity-strategy-controller.yaml"

    # Vertical Elasticity Strategy controller
    "ts/apps/elasticity/vertical-elasticity-strategy-controller/manifests/1-rbac.yaml"
    "ts/apps/elasticity/vertical-elasticity-strategy-controller/manifests/2-elasticity-strategy-controller.yaml"
)

for inputPath in ${INPUT_YAML_FILES[@]}; do
    cat "$inputPath" >> "$OUTPUT"
    echo -e "\n---\n" >> "$OUTPUT"
done

echo "Successfully wrote deployment config to $OUTPUT"
