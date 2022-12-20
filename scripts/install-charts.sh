#!/bin/sh
values_file=$1
backend_version=$(awk '/^version:[^\n]*$/ {split($0, a); print a[2]}' config/helm/causal-services/Chart.yaml)

echo "Packaging causal-services..."
helm package config/helm/causal-services --destination config/helm/dist

if [ -z "$values_file" ]; then
    echo "Installing causal-services with local values..."
    helm upgrade --install causal-services config/helm/dist/causal-services-$backend_version.tgz -f config/helm/causal-services/values.localdev.yaml
else
    echo "Installing causal-services with values from file '$values_file'..."
    helm upgrade --install causal-services config/helm/dist/causal-services-$backend_version.tgz -f $values_file --wait
fi