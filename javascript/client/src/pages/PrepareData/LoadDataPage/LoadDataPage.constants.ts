/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FileType } from '@data-wrangling-components/utilities'

export const LOAD_FILE_TYPES: string[] = [
	`.${FileType.csv}`,
	`.${FileType.tsv}`,
]
export const LOAD_ZIP_TYPES: string[] = [`.${FileType.zip}`]
