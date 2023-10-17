# ShowWhy

[Introduction to ShowWhy](https://www.youtube.com/watch?v=Im1V4h4mT-0)

ShowWhy is a suite of no-code interfaces for performing data analysis using causal ML techniques and libraries.
Currently, ShowWhy consists of four primary user-interfaces:

## Data-Wrangling

The data-wrangling application allows users to clean, transform, and prepare data for analysis.
Data tables created in the wrangling app can be used in other views within the application.

## Exposure Analysis

This interface, formerly known as ShowWhy, allows users to define and test hypotheses around causal links within data in order to validate their prior assumptions.
For example, a user may have some prior domain knowledge that "co2 emissions cause global warming" or "smoking causes cancer".
This interface will verify these causal claims using the [dowhy](https://py-why.github.io/dowhy/v0.8/) suite of refuters and estimators, and will help the user to understand the results of these analyses.

![Screenshot of the exposure analysis interface](https://user-images.githubusercontent.com/5982160/202048093-97b2f7a2-2df3-4979-90a1-f0c96d6c968e.png)

## Event Analysis

The event analysis interface allows users to use time-series observational data containing treated and untreated units to detect whether treatments had a net effect on outcomes. This interface uses the [Synthetic Differences-in-Differences](https://github.com/synth-inference/synthdid) technique for analysis.

![Screenshot of the event analysis interface](https://user-images.githubusercontent.com/5982160/202048110-558d0119-d664-488f-a345-4c3b863ba600.png)

## Causal Discovery

This interface allows users to inspect variable relationships within data, and to perform causal discovery using a variety of techniques such as [Causica](https://github.com/microsoft/causica), [NOTEARS](https://github.com/xunzheng/notears) and [DirectLiNGAM](https://lingam.readthedocs.io/en/latest/reference/direct_lingam.html).

![Screenshot of the causal discovery interface](https://user-images.githubusercontent.com/5982160/202047983-3b1c2623-5fd6-47f4-9c02-6ac0e30b5276.png)

## Getting Started

**Note: At the moment, ShowWhy does not work with Apple Mxx processors in local mode.**

To run the application locally, ensure that you have Docker installed and running on your machine. You can find instructions for installing Docker [here](https://docs.docker.com/get-docker/).

Open up a terminal application, and using the command-line interface (CLI) run the following command:

```bash
docker compose --profile all up
```

For developers wishing to contribute to the project, refer to [DEVELOPING.md](./DEVELOPING.md) for instructions on getting started.

# Deployment

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2Fshowwhy%2Fmain%2Fdocs%2Fdeployment%2Fazure-template%2FmainTemplate.json)

Check the [deployment documentation](./docs/deployment/README.md) for instructions on how to deploy to deploy SHowWhy to Azure AKS (either via one-click or manually), and how to deploy ShowWhy into a local Kubernetes instance.

# Contribute

We welcome contributions to the application.
All submissions must pass the CLABot verification.
