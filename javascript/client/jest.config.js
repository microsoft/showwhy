/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/jest-config')

const configuration = {
	...configure(),
	testEnvironment: 'jsdom',
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'~resources/getEnv': ['<rootDir>/src/resources/__mocks__/getEnv.ts'],
		'~resources/(.*)*': ['<rootDir>/src/resources/$1'],
		'~resources': ['<rootDir>/src/resources/index.ts'],
		'~arquero/(.*)': ['<rootDir>/src/arquero/index.ts'],
		'~components': ['<rootDir>/src/components/index.ts'],
		'~components/(.*)*': ['<rootDir>/src/components/$1'],
		'~state/(.*)': ['<rootDir>/src/state/$1'],
		'~state': ['<rootDir>/src/state/index.ts'],
		'~types': ['<rootDir>/src/types/index.ts'],
		'~utils/(.*)': ['<rootDir>/src/utils/$1'],
		'~utils': ['<rootDir>/src/utils/index.ts'],
		'~hooks': ['<rootDir>/src/hooks/index.ts'],
		'~styles': ['<rootDir>/src/styles/index.ts'],
	},
	setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
}
module.exports = configuration
