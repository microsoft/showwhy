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
	retries: config.get('retries') ?? 2,
	use: {
		ignoreHTTPSErrors: true,
		headless: config.get('headless'),
		video: config.get('video') ?? undefined,
		trace: config.get('trace') ?? undefined,
	},
	expect: {
		timeout: config.get('expectTimeout') ?? 10000,
	},
}

export default pwConfig
