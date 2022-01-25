/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Metadata } from '../Metadata'
import { FileDefinition } from './FileDefinition'

export interface DataTableFileDefinition extends FileDefinition {
	primary?: boolean
	metadata?: Metadata
	/**
	 * Optional explicit delimiter to parse data table with.
	 * Will default to trying to guess from the file extension.
	 * TODO: support non-delimited files such as JSON
	 */
	delimiter?: string
}
