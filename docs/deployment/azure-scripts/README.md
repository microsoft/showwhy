# AKS ARM Template
This Azure Resource Manager (ARM) template deploys an Azure Kubernetes Service (AKS) cluster with the specified parameters. The template also includes a deployment for installing Helm, a package manager for Kubernetes.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2Fshowwhy%2Fazure%2Fdocs%2Fdeployment%2Fazure-scripts%2Fall.json)

**Please note that:**

**1.    You must have:
Microsoft.Authorization/roleAssignments/write permissions, such as `User Access Administrator` or `Owner`.**

**2.    The aks cluster will be only accessible by Azure Portal, it's not generating a ssh key for external access.**

**3.    It has self signed certificated for now, so when you access it will say 'Your connection is not private', you'll have to click on the advanced to proceed to the deployed website**

**4.    It's not auth enabled.**
## Parameters:
`clusterName`: The name of the Managed Cluster resource.

`dnsPrefix`: Optional DNS prefix to use with hosted Kubernetes API server FQDN ({prefix}.{location}.cloudapp.azure.com).

`osDiskSizeGB`: Disk size (in GB) to provision for each of the agent pool nodes. This value ranges from 0 to 1023. Specifying 0 will apply the default disk size for that agentVMSize.

`agentCount`: The number of nodes for the cluster.

`agentVMSize`: The size of the Virtual Machine.

`linuxAdminUsername`: User name for the Linux Virtual Machines.

`enableAuth`: If you would like authentication enabled to access the platform, set this as true, follow [this steps to create an app registration](../AKS_DEPLOY.md#5-1-Authentication)

`clientId`: Client ID from the app registration

`clientSecret`: Client Secret from the app registration

## Resources
The template deploys the following resources:

A Managed Cluster resource using the specified clusterName, dnsPrefix, osDiskSizeGB, agentCount, and agentVMSize parameters.

A deployment for installing Helm using the nodeResourceGroup variable and the clusterName and linuxAdminUsername parameters.

## Deployment
To deploy the template, you can use the Azure portal, Azure PowerShell, or the Azure CLI.

In the Azure portal, select Create a resource, search for "AKS ARM Template", and select it from the results.
Follow the prompts to enter the required parameters and select any optional


A Managed Cluster resource using the specified clusterName, dnsPrefix, osDiskSizeGB, agentCount, agentVMSize, linuxAdminUsername, and sshRSAPublicKey parameters.
A deployment that installs Helm on the Managed Cluster.

## Output
`url`: The url to access your deployed platform
