/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Entry as ZipEntry } from '@zip.js/zip.js'

export type Entry = ZipEntry

export interface ZipData {
	json?: Entry
	tables?: Entry[]
	results?: Entry
	name?: string
}
