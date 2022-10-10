/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { BaseFile, Json } from '@datashaper/utilities'

import type { SignificanceTestStatus } from '../api/SignificanceTestStatus.js'
import type { RunHistory } from '../runs/RunHistory.js'

export interface ZipFileData {
	json?: Json
	tables?: BaseFile[]
	notebooks?: BaseFile[]
	results?: {
		file?: BaseFile
		dataUri: string
	}
	name?: string
	runHistory?: RunHistory[]
	significanceTests?: SignificanceTestStatus[]
}
