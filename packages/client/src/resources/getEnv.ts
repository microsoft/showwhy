/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function getEnv() {
	return {
		BASE_URL: import.meta.env.VITE_API_URI as string,
		CHECK_STATUS_API_KEY: import.meta.env.VITE_CHECK_STATUS_API_KEY as string,
		VITE_CHECK_SIGNIFICANCE_STATUS_API_KEY: import.meta.env
			.VITE_CHECK_SIGNIFICANCE_STATUS_API_KEY as string,
		DOWNLOAD_FILES_API_KEY: import.meta.env
			.VITE_DOWNLOAD_FILES_API_KEY as string,
		ORCHESTRATORS_API_KEY: import.meta.env.VITE_ORCHESTRATORS_API_KEY as string,
		UPLOAD_FILES_API_KEY: import.meta.env.VITE_UPLOAD_FILES_API_KEY as string,
		EXECUTIONS_NUMBER_API_KEY: import.meta.env
			.VITE_EXECUTIONS_NUMBER_API_KEY as string,
	}
}
