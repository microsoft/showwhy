/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface EnvSettings {
	EXPOSURE_API_URL: string
}

export function getEnv(): EnvSettings {
	let exposureApiUrl = process.env?.['EXPOSURE_API_URL'] || '/api/exposure'

	if (exposureApiUrl.endsWith('/')) {
		exposureApiUrl = exposureApiUrl.substring(0, exposureApiUrl.length - 1)
	}

	return {
		EXPOSURE_API_URL: exposureApiUrl,
	}
}
