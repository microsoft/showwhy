# AKS ARM Template
This Azure Resource Manager (ARM) template deploys an Azure Kubernetes Service (AKS) cluster with the specified parameters. The template also includes Helm, a package manager for Kubernetes.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2Fshowwhy%2Fmain%2Fdocs%2Fdeployment%2Fazure-scripts%2Fall.json)

**Please note that:**

**1.    You must have:
Microsoft.Authorization/roleAssignments/write permissions, such as `User Access Administrator` or `Owner`.**

**2.    The aks cluster will be only accessible by Azure Portal, it's not generating a ssh key for external access.**

**3.    The application will have a self-signed certificate, when you access it you will se an error stating "Your connection is not private".**

## Parameters:
`Subscription`: The subscription to be billed for the resources.

`ResourceGroup`: The collection of resources for this to be deployed to.

`Region`: The region for the resources. If you chose an existing resource group, it will default to it.

`clusterName`: The name of the Managed Cluster resource.

`dnsPrefix`: Optional DNS prefix to use with hosted Kubernetes API server FQDN ({dnsPrefix}.{location}.cloudapp.azure.com).

`osDiskSizeGB`: Disk size (in GB) to provision for each of the agent pool nodes. This value ranges from 0 to 1023. Specifying 0 will apply the default disk size for that agentVMSize.

`agentCount`: The number of nodes for the cluster.

`agentVMSize`: The size of the Virtual Machine.

If you wounld't like any form of authentication you can proceed to Review + create.

<details id="section-1"><summary>Deploy with authentication</summary>

To authenticate requests made to the services in the cluster we will use the [OAuth2 Proxy](https://oauth2-proxy.github.io/oauth2-proxy/) service.

We need to create our APP registration on Azure Active Directory:

- concatename the parameters to create the DOMAIN value: {dnsPrefix}.{location}.cloudapp.azure.com

1. Create the new APP registration (Single tenant).
2. In the `Overview` left menu, the Application (client) ID will be the `{clientId}`  used below.
3. In the `Authentication` left menu add a new Web Platform configuration with:
    1. Redirect URL: `https://{DOMAIN}/oauth2/callback`.
    2. Front-channel logout URL: `https://{DOMAIN}/oauth2/sign_out`.
4. In the `Certificates & secrets` left menu add a new client secret. Make sure to copy the newly created secret value, which will be the `{clientSecret}` used below.
5. In the `API permissions` left menu click on `Microsoft.Graph` and select the `email` and `openid` permissions (OpenID permissions). You won't need `User.Read`, so you can remove it.
6. In the `Expose an API` left menu, click on `set` near to `Application ID URI`, use the suggested value and click `Save`.
7. In the `Manifest` left menu, add or update the `accessTokenAcceptedVersion` in the JSON config to `2` (integer, not string - `"accessTokenAcceptedVersion": 2`).

## Parameters:

`clientId`: Client ID from the app registration

`clientSecret`: Client Secret from the app registration

</details>

<details><summary>Add authentication after deployment</summary>

You can add authentication later if you want.
1. Follow the above example on `Deploy with authentication` to create a new APP registration
2. Click the button to deploy the authentication script:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2Fshowwhy%2Fmain%2Fdocs%2Fdeployment%2Fazure-scripts%2Fauth.json)

## Parameters:
`Subscription`: The subscription of the existing cluster.

`Resource group`: The resource group of the existing cluster

`Region`: Will default to the resource group's region.

`Cluster Name`: The name of the existing cluster.

`Identity Name`: In the existing resource group, copy the name of the resource of Type: `
Managed Identity`

`Helm App Location`: The helm script to install the dependencies (leave the default)

`clientId`: Client ID from the app registration

`clientSecret`: Client Secret from the app registration

`domain`: Full URL of the application

</details>

## Deployment
To deploy the template, you can use the Azure portal, Azure PowerShell, or the Azure CLI.

In the Azure portal, select Create a resource, search for "AKS ARM Template", and select it from the results.
Follow the prompts to enter the required parameters and confirm it.
This will create two resource groups, one with the resource group name that yopu passed and a second one starting with MC_{RESOURCE_GROUP}_{CLUSTER_NAME}_{REGION}.

## Output
`url`: The url to access your deployed platform
