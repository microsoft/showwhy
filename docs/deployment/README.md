# Deploying ShowWhy

## Architectural Notes
ShowWhy is split between a front-end web-based client and a containerized Python backend. The backend image may also be run in "worker" mode to provide parallel compute resources for performing long-running tasks. A typical deployment will consist of: 

* A frontend web-client, deployed as a static website or as a docker container.
* A backend API server, deployed as a docker container.
* A worker node, deployed as a docker container with extra worker configuration.

## Deployment Options
Our team deploys ShowWhy using Azure AKS. See the [Azure Deployment documentation](./azure-scripts/README.md) for details.

If you are interested in testing out a deployment configuration locally using Kubernetes, see the [local deployment](./LOCAL_DEPLOY.md) instructions. Please note that this should only be used for debugging infrastructural issues. For application development or for test-driving the application locally the [getting started](../../README.md#getting-started) instructions are much simpler and will be less demanding on your machine.
