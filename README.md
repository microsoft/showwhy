# ShowWhy

ShowWhy is a suite of no-code tools for performing data analysis using causal techniques and causal ML tools.
Currently, ShowWhy consists of four primary tools:

## Data-Wrangling

The data-wrangling application allows users to clean, transform, and prepare data for analysis.
Data tables created in the wrangling app can be used in other tools within the application.

## Exposure Analysis

This tool, formerly known as ShowWhy, allows users to define and test hypotheses around causal links within data in order to validate their prior assumptions.
For example, a user may have some prior domain knowledge that "co2 emissions cause global warming" or "smoking causes cancer".
This tool will verify these causal claims using the [dowhy](https://py-why.github.io/dowhy/v0.8/) suite of refuters and estimators, and will help the user to understand the results of these analyses.

## Event Analysis

The event analysis tool allows users to use time-series observational data containing treated and untreated units to detect whether treatments had a net effect on outcomes. This tool uses the [Synthetic Differences-in-Differences](https://github.com/synth-inference/synthdid) technique for analysis.

## Causal Discovery

This tool allows users to inspect variable relationships within data, and to perform causal discovery using a variety of techniques such as [Causica](https://github.com/microsoft/causica), [NOTEARS](https://github.com/xunzheng/notears) and [DirectLiNGAM](https://lingam.readthedocs.io/en/latest/reference/direct_lingam.html).

# Getting Started

See [DEVELOPING.md](./DEVELOPING.md) for instructions on how to get started running and developing ShowWhy.

# Deployment

Check the [deployment documentation](./docs/deployment/README.md) for instructions on how to deploy to a local kubernetes instance or to AKS on Azure.

# Contribute

We welcome contributions to the application.
All submissions must pass the CLABot verification.
