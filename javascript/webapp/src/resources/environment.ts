/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface EnvSettings {
	BASE_URL: string
	VITE_API_FUNCTIONS_KEY: string
}

export function getEnv(): EnvSettings {
	return {
		BASE_URL: import.meta.env['VITE_API_URI'] as string,
		VITE_API_FUNCTIONS_KEY: import.meta.env['VITE_API_FUNCTIONS_KEY'] as string,
	}
}
