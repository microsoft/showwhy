/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { AlternativeModelsRequest } from '../api'
import { GraphNodeType } from '~enums'
import { Graph } from '~interfaces'

export interface GraphNodeData {
	id: string
	value: string
	name: string
	type?: GraphNodeType

	result?: string
	causal_model?: string
	treatment?: string
	outcome?: string
	dataframe?: string

	ref?: string

	controls?: string[]
	causal_graph?: Graph
	estimator_specs?: any
	model_specs?: AlternativeModelsRequest[]
	refuter_specs?: any
}
