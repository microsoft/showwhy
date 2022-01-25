/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface GraphNode {
	data: {
		id: string
		value: string
		name: string
		type?: string
		causal_model?: string
		result?: string
		treatment?: string
		outcome?: string
		ref?: string
		dataframe?: string
	}
}
