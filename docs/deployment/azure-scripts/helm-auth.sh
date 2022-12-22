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
az aks get-credentials -g $RESOURCEGROUP -n $CLUSTER_NAME

auth=false
if [ -v $CLIENT_ID ];then
    auth=true
    cookieName=_auth_token

    randomSecretCookie=`python -c 'import os,base64; print(base64.urlsafe_b64encode(os.urandom(32)).decode())'`

    # kubectl create namespace oauth-proxy

   cat > oauth-proxy.yaml <<EOF
apiVersion:v1
kind:Secret
metadata:
name:oauth-proxy-secret
namespace:oauth-proxy
stringData:
oidc-issuer-url:https://login.microsoftonline.com/$TENANT_ID/v2.0
stringData.scope:openid email
stringData.client-id:$CLIENT_ID
stringData.client-secret:$CLIENT_SECRET
stringData.cookie-secret:$randomSecretCookie
stringData.cookie-name:$secretName
EOF

    kubectl apply -f oauth-proxy.yaml
fi

# Install helm package from ghcr
helm upgrade --install causal-services $HELM_APP_LOCATION \
    --set enableAuthentication=$auth,causalImagesPullPolicy=Always,causalImagesRegistry=$CAUSAL_REGISTRY,domain=$DOMAIN

# Add ingress
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx --create-namespace --namespace ingressnginx1 --set controller.service.loadBalancerIP=$PUBLICIP --set controller.service.externalTrafficPolicy=Local

echo \{\"Status\":\"Complete\"\} > $AZ_SCRIPTS_OUTPUT_PATH