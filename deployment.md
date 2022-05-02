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
    - For each exposed function inside the function App (Functions -> Functions blade), get function key in the Developer -> Function Keys blade
      - `VITE_API_URI`: The url of the functions app (normally https://the_name_of_the_function_app.azurewebsites.net)
      - `VITE_UPLOAD_FILES_API_KEY`: UploadFile
      - `VITE_DOWNLOAD_FILES_API_KEY`: GetDownloadUrl
      - `VITE_CHECK_STATUS_API_KEY`: CheckInferenceStatus
      - `VITE_CHECK_SIGNIFICANCE_STATUS_API_KEY`: CheckSignificanceTestStatus
      - `VITE_ORCHESTRATORS_API_KEY`: ExecuteNode
      - `VITE_EXECUTIONS_NUMBER_API_KEY`: GetNumberOfExecutions
