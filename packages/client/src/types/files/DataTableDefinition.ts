/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DataTableMetadata } from './DataTableMetadata'
import type { FileDefinition } from './FileDefinition'

export interface DataTableFileDefinition extends FileDefinition {
	primary?: boolean
	metadata?: DataTableMetadata
	/**
	 * Optional explicit delimiter to parse data table with.
	 * Will default to trying to guess from the file extension.
	 * TODO: support non-delimited files such as JSON
	 */
	delimiter?: string
}
