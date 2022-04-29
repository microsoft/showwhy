# Introduction

This repository contains the code for the ShowWhy Front-end, written with React and Typescript.

# Getting Started

There are two ways you can run this project

## 1. yarn

### Pre-requisites

1. Install [node.js](https://nodejs.org/en/download/) for your platform
2. Install [yarn](https://classic.yarnpkg.com/en/docs/install)

### Running

1. `yarn install` - will get app dependencies downloaded and installed (see dependencies section below)
2. `yarn start` - will run the dev server and launch the app in your browser, normally at http://localhost:3000

## 2. docker

1. Follow the [instructions here](https://github.com/microsoft/showwhy#installation-process)

# Folder structure

- src
  - components: contains the App and the GeneralSteps components. All other reusable components are in the @showwhy/components package.
  - data: stepLists and config for the left side panel menu
  - hooks: reusable [React hooks](https://reactjs.org/docs/hooks-intro.html) used within the app
    - test: Jest test for the hooks
  - locales: guidance tests for the pages, separated by language so in the future can be used with Internationalization (i18n).
    - en-US
  - markdown: markdown files that are used for the Guidance section on each step of the app
  - pages: pages separated by their step title. Pages have lazy loading and a hooks with it's business logic.
  - resources: REST api resources and preparation of objects to be sent
  - state: Recoil state
- .env: file with the local variables to be used within the app (do not commit this file, sensitive information)
- .env.prod: file with the production variables to be used within the app

## Tests

1. `yarn test` - Run unit tests with [jest](https://jestjs.io/), and [react testing library](https://testing-library.com/docs/react-testing-library/intro) and [react hooks testing library](https://github.com/testing-library/react-hooks-testing-library)

1. `yarn test:cov` - Run unit tests generating a code coverage report
