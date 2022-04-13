/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/jest-config')

const configuration = {
	...configure(),
	testEnvironment: 'jsdom',
	extensionsToTreatAsEsm: ['.ts'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
}
module.exports = configuration
