# Acceptance Tests

This package contains the end-to-end acceptance tests for the ShowWhy webapp. There is a test file for each of the pages of the app, where the most common use scenarios are covered.

## Folder structure

- config: Playwright environment config files (default and ci)
- files: Zip files used for the tests
- pageObjects: Model of each of the pages of the app
- pw-tests: Tests for each of the pages of the app
- playwright.config.ts
- util.ts

## Tests

1. `yarn install` - Install project dependencies

2. `yarn install:playwright_deps` - Install playwright dependencies

3. `yarn acceptance:test-localhost` - Build the webapp and start the tests headless
