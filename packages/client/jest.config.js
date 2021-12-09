/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/jest-config')

module.exports = {
	...configure(),
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		'~arquero/(.*)': ['<rootDir>/src/arquero/index.ts'],
		'~components': ['<rootDir>/src/components/index.ts'],
		'~components/(.*)*': ['<rootDir>/src/components/$1'],
		'~resources': ['<rootDir>/src/resources/index.ts'],
		'~resources/(.*)*': ['<rootDir>/src/resources/*'],
		'~state': ['<rootDir>/src/state/index.ts'],
		'~state/(.*)': ['<rootDir>/src/state/*'],
		'~enums': ['<rootDir>/src/common/enums/index.ts'],
		'~interfaces': ['<rootDir>/src/common/interfaces/index.ts'],
		'~utils': ['<rootDir>/src/common/utils/index.ts'],
		'~types': ['<rootDir>/src/common/types/index.ts'],
		'~utils/(.*)': ['<rootDir>/src/common/utils/$1'],
		'~hooks': ['<rootDir>/src/hooks/index.ts'],
		'~styles': ['<rootDir>/src/styles/index.ts'],
		'~resources/getEnv': ['<rootDir>/src/resources/__mocks__/getEnv'],
	},
}
