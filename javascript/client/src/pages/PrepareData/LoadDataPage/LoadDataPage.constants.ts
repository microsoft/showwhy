/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FileType } from '@data-wrangling-components/utilities'
import type { IDropdownOption } from '@fluentui/react'

export const delimiterOptions: IDropdownOption[] = [
	{ key: '\t', text: 'Tab' },
	{ key: ';', text: 'Semicolon' },
	{ key: ',', text: 'Comma' },
	{ key: ' ', text: 'Space' },
]

export const LOAD_FILE_TYPES: string[] = [
	`.${FileType.csv}`,
	`.${FileType.tsv}`,
]
export const LOAD_ZIP_TYPES: string[] = [`.${FileType.zip}`]
