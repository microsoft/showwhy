# Deploying to AKS

This tutorial describes how to create and configure a kubernetes cluster on Azure (AKS) in order to run the [`causal-services` helm chart](../config/helm/causal-services/).

## 0. Pre-requirements

We will need [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/), [Helm](https://helm.sh/) and [kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/) installed locally installed.


## 1. Initial setup

### 1.1. Azure CLI login

Let's login into Azure and set our subscription:

```bash
> az login
> az account set --subscription {SUBSCRIPTION_NAME}
```

### 1.2. Create resource group

We can then create our resource group that will store our cluster.

```bash
> az group create --name {RESOURCE_GROUP_NAME} --location {LOCATION}
```

## 2. AKS Cluster

### 2.1. AKS Cluster

> In this example the cluster will be created with 2 nodes.

```bash
> az aks create -g {RESOURCE_GROUP_NAME} -n {AKS_CLUSTER_NAME} --enable-managed-identity --node-count 2 --enable-addons monitoring --enable-msi-auth-for-monitoring --generate-ssh-keys --location {LOCATION}
```

### 2.2. AKS Cluster's resource group name

Azure will also create another resource group to put the resources related to the AKS cluster, we can check its name using the following command:

```bash
> az aks show --resource-group {RESOURCE_GROUP_NAME} --name {AKS_CLUSTER_NAME} --query nodeResourceGroup -o tsv
```

The above command will output something like `MC_{RESOURCE_GROUP_NAME}_{AKS_CLUSTER_NAME}_{LOCATION}`, to which we will refer as `{AKS_RESOURCE_GROUP_NAME}`.

## 3. Ingress controller

In the setup we will use an ingress controller to allow access to the services running in the cluster and load balance the requests.

### 3.1. Creating static IP

Let's then create the static IP that will be the entry point for accessing our cluster through the ingress controller:

```bash
> az network public-ip create --resource-group {AKS_RESOURCE_GROUP_NAME} --name {INGRESS_IP_NAME} --dns-name {DNS_NAME} --sku Standard --allocation-method static --query publicIp.ipAddress -o tsv
```

The above command will output the static IP allocated, to which we will refer as `{INGRESS_STATIC_IP}`.

The fully qualified domain name will be something like: `{DNS_NAME}.{LOCATION}.cloudapp.azure.com`, to which we will refer as `{DOMAIN}`.

### 3.2. Getting access to the cluster

We will access the cluster from the machine you are running Azure CLI, to do so let's first get the credentials to the cluster configured in `kubectl`:

```bash
> az aks get-credentials --resource-group {RESOURCE_GROUP_NAME} --name {AKS_CLUSTER_NAME}
```

Then we can verify if `kubectl` is using the correct context related to the cluster we just created:

```bash
> kubectl config get-contexts
```

### 3.3. Install ingress controller

Now that we have access to the cluster through `kubectl`, let's install the NGINX ingress controller using Helm. To do so, we need to create the YAML file (`nginx-ingress.yaml`) with the configuration for our ingress controller:

```yml
controller:
  service:
    loadBalancerIP: {INGRESS_STATIC_IP}
    externalTrafficPolicy: Local
```

> Replace {INGRESS_STATIC_IP} with the IP you got in the previous steps.

Notice `externalTrafficPolicy: Local`, this is important so that the real IPs for the incoming requests are logged in the ingress controller, instead of the IPs in the local cluster.

Now we are ready to deploy our NGINX ingress controller to the cluster:

```bash
> helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
> helm repo update
> helm install ingress-nginx ingress-nginx/ingress-nginx --create-namespace --namespace {INGRESS_NAMESPACE} -f nginx-ingress.yaml
```

We can check if everything worked successfully by running:

```bash
> kubectl get all,ingress -n {INGRESS_NAMESPACE}
```

You should see the deployed ingress controller configured with your external IP in there.

## 4. Container registry

We will now create an Azure Container Registry (ACR) to store the services' images that will run in our cluster.

### 4.1. Create ACR

```bash
> az acr create --resource-group {RESOURCE_GROUP_NAME} --name {ACR_NAME} --sku Standard
```

### 4.2. Attach ACR to AKS

We need to attach our ACR to AKS, so the cluster can read the images from the registry. Notice that this will require `Owner` role on the subscription:

```bash
> az aks update -n {AKS_CLUSTER_NAME} -g {RESOURCE_GROUP_NAME} --attach-acr {ACR_NAME}
```

> Another way around it is to provide the access tokens to the ACR directly through kubernetes secrets.

## 5. Authentication

To authenticate requests made to the services in the cluster we will use the [OAuth2 Proxy](https://oauth2-proxy.github.io/oauth2-proxy/) service.

### 5.1. App registration on Azure Active Directory

We need to create our APP registration on Azure Active Directory:

1. Create the new APP registration (Single tenant).
2. In the `Authentication` left menu add a new Web Platform configuration with:
    1. Redirect URL: `https://{DOMAIN}/oauth2/callback`.
    2. Front-channel logout URL: `https://{DOMAIN}/oauth2/sign_out`.
3. In the `Certificates & secrets` left menu add a new client secret. Make sure to copy the newly created secret value, which will be the `{CLIENT_SECRET}` used below.
4. In the `API permissions` left menu click on `Microsoft.Graph` and select the `email` and `openid` permissions (OpenID permissions). You won't need `User.Read`, so you can remove it.
5. In the `Expose an API` left menu, click on `set` near to `Application ID URI`, use the suggested value and click `Save`.
6. In the `Manifest` left menu, add or update the `accessTokenAcceptedVersion` in the JSON config to `2` (integer, not string - `"accessTokenAcceptedVersion": 2`).


### 5.2. Configure secrets for causal-services Helm Chart

The `causal-services` helm chart is configured to use OAuth2 Proxy to authenticate and authorize requests. For it to properly work we will need to create a few secrets in the kubernetes cluster. The following file (`oauth-secrets.yaml`) highlights them:

```yaml
apiVersion: v1
kind: Secret
metadata:
    name: oauth-proxy-secret
    namespace: oauth-proxy
stringData:
    oidc-issuer-url: https://login.microsoftonline.com/{TENANT_ID}/v2.0
    scope: openid email
    client-id: {CLIENT_ID}
    client-secret: {CLIENT_SECRET}
    cookie-secret: {RANDOMLY_GENERATED_COOKIE_SECRET}
    cookie-name: {COOKIE_NAME}
```

- Replace `{TENANT_ID}`, `{CLIENT_ID}` and `{CLIENT_SECRET}` with information from your App Registration (available in the `Overview` left menu).

- `{RANDOMLY_GENERATED_COOKIE_SECRET}` can be generated using:

    ```bash
    python -c 'import os,base64; print(base64.urlsafe_b64encode(os.urandom(32)).decode())'
    ```

- `{COOKIE_NAME}` is the cookie name in the browser that will store the auth token (e.g. `_auth_token`).

Once you have the file properly set, create the namespace for the oauth service and apply the secrets to the cluster:

```bash
> kubectl create namespace oauth-proxy
> kubectl apply -f oauth-secrets.yaml
```

## 6. Create chart configuration file

The default configuration for the `causal-services`' chart  can be seen at [`values.yaml`](../config/helm/causal-services/values.yaml). We will need to update a few values according to what we have just created and configured. To do so, let's create a new YAML file (`values.deploy.yaml`) containing the values we need to update (replace the values with `{}` with the proper configuration):

```yaml
domain: {DOMAIN}
causalImagesPullPolicy: Always
defaultLimitRPM: 240
recreatePodsOnUpgrade: true
revisionHistoryLimit: 1
enableAuthentication: true
```

## 7. Install the `causal-services` chart

Now it's time to install our chart using the configuration file we just created:

```bash
> ./scripts/install-charts.sh values.deploy.yaml
```

## 8. Verify all services are properly running

```bash
> ./scripts/list-resources.sh
```

You should see the services up and running according to their namespace.

## 9. Access application

The application should now be available at: `https://{DOMAIN}`.