# AKS ARM Template
The Azure Resource Manager (ARM) template deploys an Azure Kubernetes Service (AKS) cluster with the specified parameters. The template also includes Helm, a package manager for Kubernetes.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2Fshowwhy%2Fmain%2Fdocs%2Fdeployment%2Fazure-scripts%2Fall.json)

The button will run the ARM template in Azure with a set of reasonable defaults, and should execute with no problems if you have the permissions to create the resources. If you think you need authentication, please read [those instructions](#create-authentication) below first.

**Please note that:**

**1.    You must have: Microsoft.Authorization/roleAssignments/write permissions, such as `User Access Administrator` or `Owner`.**

**2.    The aks cluster will be only accessible by Azure Portal, it's not generating a ssh key for external access.**

**3.    The application will run with SSL using a self-signed certificate: when you access it your browser will se an error stating "Your connection is not private".**

## Parameters:

- `Subscription`: The subscription to be billed for the resources.
- `ResourceGroup`: The collection of resources for this to be deployed to.
- `Region`: The region for the resources. If you chose an existing resource group, it will default to it the region for that group.
- `clusterName`: The name of the Managed Cluster resource to create.
- `dnsPrefix`: DNS prefix to use with hosted Kubernetes API server FQDN ({dnsPrefix}.{location}.cloudapp.azure.com). This will create a unique URL for your application.
- `osDiskSizeGB`: Disk size (in GB) to provision for each of the agent pool nodes. This value ranges from 0 to 1023. Specifying 0 will apply the default disk size for that agentVMSize.
- `agentCount`: The number of nodes for the cluster.
- `agentVMSize`: The size of the Virtual Machine (SKU). Note that this VM option must be available in the region you select. We can't get a list dynamically in the script, so if you're unsure please use the [product finder](https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/). Our script default VM (Standard_D2s_v3) is available in the default region (East US 2).

If you don't need authentication securing the application, you can proceed to **Review + create** now. Otherwise, create or open your auth app to get the values for the last two parameters:

- `clientId`: Client ID from the app registration
- `clientSecret`: Client Secret from the app registration

## Create authentication

It's up to you whether you add authentication to protect your instance. ShowWhy does not store user data or "accounts", and only retains uploaded input data on the server for a few hours in a cache to reduce network traffic while you use the application. However, if you want to be sure your data is fully protected, you can create an authentication app and connect it to the instance.

To authenticate requests made to the services in the cluster we use the [OAuth2 Proxy](https://oauth2-proxy.github.io/oauth2-proxy/) service.

We need to create our APP registration on Azure Active Directory:

> NOTE: construct the `DOMAIN` value used below like so: `{dnsPrefix}.{region}.cloudapp.azure.com`

1. Create the new APP registration (Single tenant).
2. In the `Overview` left menu, the Application (client) ID will be the `{clientId}`  used below.
3. In the `Authentication` left menu add a new Web Platform configuration with:
    1. Redirect URL: `https://{DOMAIN}/oauth2/callback`.
    2. Front-channel logout URL: `https://{DOMAIN}/oauth2/sign_out`.
4. In the `Certificates & secrets` left menu add a new client secret. Make sure to copy the newly created secret value, which will be the `{clientSecret}` used below.
5. In the `API permissions` left menu click on `Microsoft.Graph` and select the `email` and `openid` permissions (OpenID permissions). You won't need `User.Read`, so you can remove it.
6. In the `Expose an API` left menu, click on `set` near to `Application ID URI`, use the suggested value and click `Save`.
7. In the `Manifest` left menu, add or update the `accessTokenAcceptedVersion` in the JSON config to `2` (integer, not string - `"accessTokenAcceptedVersion": 2`).

## Add authentication after deployment

If you've already created a deployment and want to update it later with authentication you can do so with this modified script.

1. Follow the above instructions under "Create authentication" to create a new APP registration
2. Click the button to deploy the authentication-adding script:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2Fshowwhy%2Fmain%2Fdocs%2Fdeployment%2Fazure-scripts%2Fauth.json)

### Parameters:

Most of the parameters are the same as for creating the new deployment. Otherwise:

- `clusterName`: The name of the *existing* cluster.
- `identityName`: In the existing Resource group, copy the name of the resource with type "Managed Identity"
- `helmAppLocation`: The helm script to install the dependencies (leave the default)
- `domain`: Full URL of the application

## Alternate deployment
To deploy the template manually you can use the Azure Portal, Azure PowerShell, or the Azure CLI instead of the buttons on this page.

In the Azure Portal, select "Create a resource", search for "AKS ARM Template", and select it from the results.
Follow the prompts to enter the required parameters and confirm it.

## Output

This script will create two resource groups, one with the resource group name that you specified and a second one starting named like `MC_{RESOURCE_GROUP}_{CLUSTER_NAME}_{REGION}` (this is created to contain managed cluster infrastructure resources for Kubernetes).

The URL to access your application will be composed of the DNS prefix you chose and the region, like `https://{dnsPrefix}.{region}.cloudapp.azure.com`. You can find it by looking in the MC resource group and finding the Kubernetes public IP.
