/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { PlaywrightTestConfig } from '@playwright/test'
import config from 'config'

const pwConfig: PlaywrightTestConfig = {
	testDir: 'pw-tests',
	testMatch: '**/pw-tests/*.spec.ts',
	workers: config.get('workers') ?? undefined,
	timeout: config.get('timeout') ?? undefined,
	retries: config.get('retries') ?? 1,
	reporter: [
		['github'],
		['junit', { outputFile: 'test-results/playwright-junit.xml' }],
	],
	use: {
		ignoreHTTPSErrors: true,
		headless: config.get('headless'),
		video: config.get('video') ?? undefined,
		trace: config.get('trace') ?? undefined,
	},
	expect: {
		timeout: 10000,
	},
}

export default pwConfig
