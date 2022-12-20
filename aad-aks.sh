#!/bin/bash
set -e

az account set --subscription $SUBSCRIPTION
az aks install-cli
# Get cluster credentials
az aks get-credentials -g $RESOURCEGROUP -n $CLUSTER_NAME
echo "LOGIN SUCCESSFUL"

secretName=Default
# az extension add --upgrade -n account

tenantId=`az account tenant list --query [0].tenantId`

# add graph api email and openid access (universally known ids)
cat > app-manifest.json << EOF
[
    {
        "resourceAppId": "00000003-0000-0000-c000-000000000000",
			"resourceAccess": [
				{
					"id": "37f7f235-527c-4136-accd-4a02d197296e",
					"type": "Scope"
				},
				{
					"id": "64a6cdd6-aab1-4aaf-94b8-3cc8405e90d0",
					"type": "Scope"
				}
			]
        "accessTokenAcceptedVersion": 2,
        "signInAudience": "AzureADMyOrg"
    }
]
EOF

# Create app registration
appId=`az ad app create --display-name $CLUSTER_NAME --identifier-uris "api://$CLUSTER_NAME" --web-redirect-uris https://$DNS_PREFIX.$LOCATION.cloudapp.azure.com/oauth2/callback --required-resource-accesses @app-manifest.json --query id -o tsv`

# Get client secret
appSecret=`az ad app credential reset --id $appId --display-name $secretName --query password --o tsv`

cookieName=_auth_token

randomSecretCookie=`python -c 'import os,base64; print(base64.urlsafe_b64encode(os.urandom(32)).decode())'`

kubectl create namespace oauth-proxy

cat > oauth-proxy.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
    name: oauth-proxy-secret
    namespace: oauth-proxy
stringData:
    oidc-issuer-url: https://login.microsoftonline.com/${tenantId}/v2.0
    stringData.scope: openid email
    stringData.client-id: $appId
    stringData.client-secret: $appSecret
    stringData.cookie-secret: $randomSecretCookie
    stringData.cookie-name: $secretName
EOF

kubectl apply -f oauth-proxy.yaml

echo \{\"Status\":\"Complete\"\} > $AZ_SCRIPTS_OUTPUT_PATH