# AKS ARM Template
This Azure Resource Manager (ARM) template deploys an Azure Kubernetes Service (AKS) cluster with the specified parameters. The template also includes Helm, a package manager for Kubernetes.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2Fshowwhy%2Fazure%2Fdocs%2Fdeployment%2Fazure-scripts%2Fall.json)

**Please note that:**

**1.    You must have:
Microsoft.Authorization/roleAssignments/write permissions, such as `User Access Administrator` or `Owner`.**

**2.    The aks cluster will be only accessible by Azure Portal, it's not generating a ssh key for external access.**

**3.    The application will have a self-signed certificate, when you access it you will se an error stating "Your connection is not private".**

## Parameters:
`clusterName`: The name of the Managed Cluster resource.

`dnsPrefix`: Optional DNS prefix to use with hosted Kubernetes API server FQDN ({prefix}.{location}.cloudapp.azure.com).

`osDiskSizeGB`: Disk size (in GB) to provision for each of the agent pool nodes. This value ranges from 0 to 1023. Specifying 0 will apply the default disk size for that agentVMSize.

`agentCount`: The number of nodes for the cluster.

`agentVMSize`: The size of the Virtual Machine.

If you would like authentication enabled to access the platform, follow [this steps to create an app registration](../AKS_DEPLOY.md#5-1-Authentication) and pass the following:

`clientId`: Client ID from the app registration

`clientSecret`: Client Secret from the app registration

## Resources
The template deploys the following resources:

A Managed Cluster resource using the specified clusterName, dnsPrefix, osDiskSizeGB, agentCount, and agentVMSize parameters.

A deployment for installing Helm using the nodeResourceGroup variable and the clusterName parameters.

## Deployment
To deploy the template, you can use the Azure portal, Azure PowerShell, or the Azure CLI.

In the Azure portal, select Create a resource, search for "AKS ARM Template", and select it from the results.
Follow the prompts to enter the required parameters and confirm it.

A Managed Cluster resource using the specified clusterName, dnsPrefix, osDiskSizeGB, agentCount, agentVMSize, linuxAdminUsername, and sshRSAPublicKey parameters.
A deployment that installs Helm on the Managed Cluster.

## Output
`url`: The url to access your deployed platform
