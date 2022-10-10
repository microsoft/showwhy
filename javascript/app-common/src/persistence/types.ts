/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { BaseFile } from '@datashaper/utilities'

/**
 * The Persistence Service available in the application.
 * This service is responsible for saving and loading data packages.
 */
export interface PersistenceService {
	/**
	 * Save a data-package to a zip file and download to the client machine.
	 *
	 * @param projectName - the project name to save. Default is 'project
	 */
	save(projectName?: string): Promise<void>

	/**
	 * Load a data-package file from zip file contents.
	 *
	 * @param file - The zip file containing the data-package to load
	 */
	load(file: BaseFile): Promise<void>
}
