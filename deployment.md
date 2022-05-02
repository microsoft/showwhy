# Azure Resources

Create and configure the following resources

## Python

- Storage account
- Cosmos DB
- Function App
  - Runtime stack: Python v3.9
  - Version: ~3
  - Environment Variables:
    - COSMOS_CONNECTION: CosmosDB Connection String (available from Settings -> Keys in CosmosDB instance )
    - CONTEXT_STORAGE_ACCOUNT_CONNECTION: Storage Account access key (available from Security & Networking Tab)
- [YAML file](/python/.vsts-ci.yml)
  - Create a pipeline with this yml file
  - Create the following pipeline variables:
    - `subscription`: The Azure Subscription the resources were created
      - Ensure the pipeline or Azure DevOps project has access to this subscription
    - `functionName`: The name of the function app you created

## WebApp

- App Service
  - Runtime stack: NodeJS = 16
- [YAML file](.vsts-ci.yml)
  - Create a pipeline with this yml file
  - Create the following pipeline variables:
    - `subscription`: The Azure Subscription the resources were created
      - Ensure the pipeline or Azure DevOps project has access to this subscription
    - `webAppName`: The name of the App Service you created
      - `VITE_API_URI`: The url of the functions app (normally https://the_name_of_the_function_app.azurewebsites.net)
      - `VITE_API_FUNCTIONS_KEY`: default function Host keys (available from Functions -> App Keys Tab in Function App instance)
