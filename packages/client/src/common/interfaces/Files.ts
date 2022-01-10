/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { BaseFile } from '@data-wrangling-components/utilities'

export interface ZipData {
	json?: BaseFile
	tables?: BaseFile[]
	results?: {
		entry: BaseFile
		dataUri: string
	}
	name?: string
}
