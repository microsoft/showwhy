# Developing ShowWhy

## Prerequisite Software
**At the moment, it doesn't work with Apple M1 processors. We're verifying the issue and will provide an update in the future releases.**

- [Docker](https://docs.docker.com/get-docker/)
- [Node 16.x](https://nodejs.org)
- [Python 3.8.x](https://www.python.org/)
- [Yarn](https://yarnpkg.com) (`npm i -g yarn`)
- [Poetry 1.2](https://python-poetry.org/)
- [GraphViz](https://graphviz.org/) (`apt-get install graphviz libgraphviz-dev`)
- Python dev headers (`apt-get install libpython3.8-dev libpython3.9-dev`)

# Getting Started

Before anything you will need to install the proper dependencies and build the frontend code:

```bash
yarn install
yarn build # or yarn force_build
```

The application is designed to start up using [Docker](https://www.docker.com/products/docker-desktop/). You should have the `docker` tools available in your shell, particulary [`docker-compose`](https://docs.docker.com/compose/).
To start the application, run the following command:

```bash
yarn start # or docker-compose --profile all up
```

To start the services and webapps separately, you will need [yarn](https://yarnpkg.com/en/docs/install) available:

```bash
yarn start_backend # or docker-compose --profile backend up
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
