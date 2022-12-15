#!/bin/bash
set -e

# Download and install Helm
wget -O helm.tgz https://get.helm.sh/helm-v3.10.3-linux-amd64.tar.gz
tar -zxvf helm-v3.10.3-linux-amd64.tar.gz
mv linux-amd64/helm /usr/local/bin/helm
# Install kubectl
echo "LOGIN..."
az account set --subscription $SUBSCRIPTION
az aks install-cli
# Get cluster credentials
az aks get-credentials -g $RESOURCEGROUP -n $CLUSTER_NAME
echo "LOGIN SUCCESSFUL"

helm pull $HELM_APP
helm upgrade --install $HELM_APP_NAME $HELM_APP \
    --set enableAuthentication=false,causalImagesPullPolicy=Always,causalImagesRegistry=$CAUSAL_REGISTRY,domain=$DOMAIN

echo \{\"Status\":\"Complete\"\} > $AZ_SCRIPTS_OUTPUT_PATH