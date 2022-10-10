# Deploying locally

This tutorial describes how to run the [`causal-services` helm chart](../config/helm/causal-services/) locally on kubernetes.

## 0. Pre-requirements

You will need [Docker](https://docs.docker.com/engine/install/) and [Helm](https://helm.sh/) installed, and also a [Kubernetes](https://kubernetes.io/) cluster up and running.

For local development, one good alternative for a local kubernetes cluster is [minikube](https://minikube.sigs.k8s.io/docs/start). Which is the one used in this tutorial.

## 1. Install minikube

Once you have [Docker](https://docs.docker.com/engine/install/) and [Helm](https://helm.sh/docs/intro/install/) installed, install minikube by following the steps in [here](https://minikube.sigs.k8s.io/docs/start/).

## 2. Start the minikube cluster

```bash
> minikube start
```

## 3. Install NGINX ingress controller

The NGINX ingress controller is used by the `causal-services`' helm chart to expose both the backend and frontend URLs. Minikube has an addon that will take care of installing it for you:

```bash
> minikube addons enable ingress
```

> For more information see [minikube's documentation](https://minikube.sigs.k8s.io/docs/tutorials/nginx_tcp_udp_ingress/).

> This step only needs to be done once, the ingress controller installation will persist.

## 4. Evaluate minikube docker environment

We will need to build the docker images for the frontend and backend services, those images should be available to the Docker daemon inside the Minikube instance. To configure your local bash to point to Minikube's docker environment run:

```bash
> eval $(minikube docker-env)
```

## 5. Build the frontend service

### 5.1. Build frontend service bundle

```bash
> yarn install
> yarn build
```

> If you want to force the service to rebuild, run: `yarn force_build`.

This will create the build directory at [`javascript/webapp`](../javascript/webapp).

### 5.2. Build frontend docker image

```bash
> ./scripts/build-frontend-images.sh
```

> This will build the following frontend service image: `app-shell`.

## 6. Build the backend services

```bash
> ./scripts/build-backend-images.sh
```

> This will build the following backend service images: `exposure`, `events` and `discover`.

## 7. Install the `causal-services` chart

```bash
> ./scripts/install-charts.sh
```

When running with no parameters the install script will deploy the chart using the [default configuration](../config/helm/causal-services/values.yaml), which includes no authentication and uses `https://localhost`.


## 8. Verify all services are properly running

```bash
> ./scripts/list-resources.sh
```

You should see the services up and running according to their namespace.

## 9. Create minikube tunnel

To be able to access the services through the ingress controller, run the following command in a separate terminal:

```bash
> minikube tunnel
```

> For more information see [minikube's documentation](https://minikube.sigs.k8s.io/docs/handbook/accessing/#example-of-loadbalancer).

## 10. Access application

The application should now be available at: https://localhost.