# Deploying ShowWhy

## Architectural Notes
ShowWhy is split between a front-end web-based client and a containerized Python backend. The backend image may also be run in "worker" mode to provide parallel compute resources for performing long-running tasks. A typical deployment will consist of: 

* A frontend web-client, deployed as a static website or as a docker container.
* A backend API server, deployed as a docker container.
* A worker node, deployed as a docker container with extra worker configuration.

## Deployment Options
We currently deploy the application using Azure Kubernetes Services (AKS). You can deploy an AKS container directly to your Azure subscription with one click, the instructions are [here](./azure-scripts/README.md). You can choose to deploy it with or without auth.

The instructions for deploying manually the application using AKS are [here](./AKS_DEPLOY.md). This method uses authentication.

If you are interested in testing out a deployment configuration locally using Kubernetes, see the [local deployment](./LOCAL_DEPLOY.md) instructions. Please note that this should only be used for debugging infrastructural issues. For application development, or test-driving the application locally. The `Getting Started` instructions in README.md are much simpler and will be less demanding on your machine.
