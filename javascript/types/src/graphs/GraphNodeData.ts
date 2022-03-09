/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Graph } from './Graph.js'
import type { GraphNodeType } from './GraphNodeType.js'

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
	model_specs?: AlternativeModelSpec[]
	refuter_specs?: any
}

export interface AlternativeModelSpec {
	confounders: string[]
	outcome_determinants: string[]
	label: string
	type: string
}
