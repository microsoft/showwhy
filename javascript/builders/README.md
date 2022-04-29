# Builders

This package contains the methods used to format the estimators, definitions, models, etc into the format the backend expects to receive the data to run the experiments.

## Folder structure

- src
  - tests: Jest test for the builders
  - Builders: helper methods that return the request structure expected from the backend.action-duration
    ### Methods:
    - buildAlternativeModels
    - buildEstimators
    - buildLoadNode
    - buildModelLevel
    - buildNodes
    - buildRefutationSpecs
    - buildSignificanceTestsNode
    - buildSpecs

## Tests

1. `yarn test` - Run unit tests with [jest](https://jestjs.io/), and [react testing library](https://testing-library.com/docs/react-testing-library/intro) and [react hooks testing library](https://github.com/testing-library/react-hooks-testing-library)
