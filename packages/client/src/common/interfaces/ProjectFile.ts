/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FileStep } from './FileStep'
import { StepList } from './Step'

export interface Project {
	key: string
	name: string
	steps: StepList[]
}

export interface ProjectFile {
	name: string
	content: string
	alias?: string
	id?: string
	loadedCorrectly?: boolean
	fileId?: string
	steps?: FileStep[]
}
