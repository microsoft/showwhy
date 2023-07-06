# Developing ShowWhy

ShowWhy is a multi-language monorepo consisting of Python backend services in the `python/` folder and JavaScript packages in the `javascript/` directory. Our JavaScript packages use [`yarn`](https://yarnpkg.com/) for dependency management and monorepo orchestration. Our backend uses `poetry` for dependency management scripting. 

Because there are a few moving parts in this system, especially in the backend, we use `docker compose` day-to-day to start up the system. Some developers run the frontend and backend with docker `docker compose up` and some just run the backend in docker compose and use yarn directly for running the frontend.

## Prerequisite Software

**ShowWhy does not currently work with Apple silicon. This is because of issues in transitive dependencies, primarily TensorFlow.**

- [Docker](https://docs.docker.com/get-docker/)
- [Node 16.x](https://nodejs.org)
- [Python 3.8.x](https://www.python.org/)
- [Yarn](https://yarnpkg.com) (`npm i -g yarn`)
- [Poetry 1.2](https://python-poetry.org/)
- [GraphViz](https://graphviz.org/) (`apt-get install graphviz libgraphviz-dev`)
- Python dev headers (`apt-get install libpython3.8-dev libpython3.9-dev`)

# Getting Started

## Overview

Before anything you will need to install the proper dependencies and build the frontend code:

```bash
yarn install
yarn build # or yarn force_build
```

The application is designed to start up using [Docker](https://www.docker.com/products/docker-desktop/). You should have the `docker` tools available in your shell, particulary [`docker compose`](https://docs.docker.com/compose/).
To start the application, run the following command:

```bash
yarn start # or docker compose --profile all up
```

To start the services and webapps separately, you will need [yarn](https://yarnpkg.com/en/docs/install) available:

```bash
yarn start_backend # or docker compose --profile backend up
yarn start_webapps
```

The application will then be available on `http://localhost:3000`

# Build and Test

The application is structured as a monorepo. Web-application packages are written using [typescript](https://www.typescriptlang.org/), and backend packages are written using [python](https://www.python.org/). [yarn](https://yarnpkg.com/en/docs/install) is used to orchestrate monorepo builds.

## Available Commands

```bash
yarn clean # clean the app
yarn assets # bundle workers and pre-process assets
yarn build # perform build steps
yarn lint # perform linting
yarn lint_fix # perform linting and correct linting issues
yarn test # run tests
yarn typecheck # perform typechecking
yarn ci # perform the full verification suite
```

# Architecture

The large pieces of ShowWhy are the React-based frontend, which is built using our [`datashaper app-framework`](https://github.com/microsoft/datashaper). This is a resource-centric app framework that allows us to build a single-page application that can be used to explore and analyze data. The framework emphasizes using in-memory datasets via `arquero`.

The frontend is built using React and Typescript, and is bundled using Webpack. Each application is a separate package, and the packages are managed using yarn workspaces. These applications export a `Resource Profile`, which a reactive JSON object that represents that application's state and associated configuration. Each `Resource Profile` can be serialized and deserialized to JSON and read from an archive. This allows us to save and load the state of the application, and we can create multiple instances of applications for comparative purposes.

The backend is built using Python and provides RESTful services for the frontend via FastAPI. The backend can also be run in 'worker' mode to support worker-based execution of long-running tasks, such as expensive Causal Discovery executions. State for these long-running tasks is stored in a Redis database.

Our application can be deployed in a variety of ways, but we deploy it using Kubernetes. See the [deployment documentation](./docs/deployment/README.md) for more information.
