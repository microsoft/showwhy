# ShowWhy

ShowWhy is a suite of no-code tools for performing data analysis using causal techniques and causal ML tools.
Currently, ShowWhy consists of four primary tools:

- Data-Wrangling
  The data-wrangling application allows users to clean, transform, and prepare data for analysis.
  Data tables created in the wrangling app can be used in other tools within the application.

- Exposure Analysis
  This tool, formerly known as ShowWhy, allows users to define and test hypotheses around causal links within data in order to validate their prior assumptions.
  For example, a user may have some prior domain knowledge that "co2 emissions cause global warming" or "smoking causes cancer".
  This tool will verify these causal claims using the [dowhy](https://py-why.github.io/dowhy/v0.8/) suite of refuters and estimators, and will help the user to understand the results of these analyses.

- Event Analysis
  The event analysis tool allows users to use time-series observational data containing treated and untreated units to detect whether treatments had a net effect on outcomes. This tool uses the [Synthetic Differences-in-Differences](https://github.com/synth-inference/synthdid) technique for analysis.

- Causal Discovery
  This tool allows users to inspect variable relationships within data, and to perform causal discovery using a variety of techniques such as [Causica](https://github.com/microsoft/causica), [NOTEARS](https://github.com/xunzheng/notears) and [DirectLiNGAM](https://lingam.readthedocs.io/en/latest/reference/direct_lingam.html).

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

# Deployment

Check the [deployment documentation](./docs/deployment/README.md) for instructions on how to deploy to a local kubernetes instance or to AKS on Azure.

# Contribute

We welcome contributions to the application.
All submissions must pass the CLABot verification.
