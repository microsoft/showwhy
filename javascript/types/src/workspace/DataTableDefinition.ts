/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FileDefinition } from './FileDefinition.js'

interface DataTableMetadata {
	/**
	 * Paper citation for a dataset to document publication
	 */
	citation?: string
	/**
	 * URL for ownership host site that user can go to for dataset
	 */
	source?: string
	/**
	 * Link to data use license for the dataset
	 */
	license?: string
}

export interface DataTableFileDefinition extends FileDefinition {
	primary?: boolean
	metadata?: DataTableMetadata
	/**
	 * Optional explicit delimiter to parse data table with.
	 * Will default to trying to guess from the file extension.
	 * TODO: support non-delimited files such as JSON
	 */
	delimiter?: string
	autoType?: boolean
	loadedCorrectly?: boolean
}
