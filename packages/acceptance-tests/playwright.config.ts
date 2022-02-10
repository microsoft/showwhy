/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { PlaywrightTestConfig } from '@playwright/test'
import config from 'config'

const pwConfig: PlaywrightTestConfig = {
	testDir: 'pw-tests',
	testMatch: '**/pw-tests/*.spec.ts',
	retries: 2,
	workers: config.get('workers') ?? undefined,
	timeout: config.get('timeout') ?? 45000,
	retries: config.get('retries') ?? undefined,
	use: {
		ignoreHTTPSErrors: true,
		headless: config.get('headless'),
		video: config.get('video') ?? undefined,
		trace: config.get('trace') ?? undefined,
	},
}

export default pwConfig
