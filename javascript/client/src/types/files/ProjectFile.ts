/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FileStep } from './FileStep'

export interface ProjectFile {
	name: string
	content: string
	alias?: string
	id?: string
	loadedCorrectly?: boolean
	fileId?: string
	steps?: FileStep[]
	delimiter?: string
}
