#!/bin/bash
set -e

# Download and install Helm
wget -O helm.tgz https://get.helm.sh/helm-v3.10.3-linux-amd64.tar.gz
tar -zxvf helm.tgz
mv linux-amd64/helm /usr/local/bin/helm

# Install kubectl
az account set --subscription $SUBSCRIPTION
az aks install-cli
# Get cluster credentials
az aks get-credentials -g $RESOURCE_GROUP -n $CLUSTER_NAME

cookieName=_auth_token
echo \{\"Auth\":\"On\"\} > $AZ_SCRIPTS_OUTPUT_PATH


randomSecretCookie=`python -c 'import os,base64; print(base64.urlsafe_b64encode(os.urandom(32)).decode())'`

# kubectl create namespace oauth-proxy
cat > oauth-proxy.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
name: oauth-proxy-secret
namespace: oauth-proxy
stringData:
oidc-issuer-url: https://login.microsoftonline.com/$TENANT_ID/v2.0
scope: openid email
client-id: $CLIENT_ID
client-secret: $CLIENT_SECRET
cookie-secret: $randomSecretCookie
cookie-name: $cookieName
EOF

kubectl create namespace oauth-proxy
kubectl apply --wait -f oauth-proxy.yaml

# Install helm package from ghcr
helm upgrade --install causal-services $HELM_APP_LOCATION \
    --set enableAuthentication=true,causalImagesPullPolicy=Always,domain=$DOMAIN

echo \{\"Status\":\"Complete\"\} > $AZ_SCRIPTS_OUTPUT_PATH