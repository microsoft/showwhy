/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { AdditionalProperties, Graph } from '~interfaces'

export interface Node extends Partial<AdditionalProperties> {
	id: string
	name: string
	result: string
	type: string
	value: string
	url?: string
	causal_model?: string
	treatment?: string
	outcome?: string
	dataframe?: string
	controls?: string[]
	causal_graph?: Graph
}
