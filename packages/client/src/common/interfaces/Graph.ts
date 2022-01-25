/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { AlternativeModelsReq } from './AlternativeModelsReq'

export interface Data {
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

interface EdgeObject {
	source: string
	target: string
}
export interface Edge {
	data: EdgeObject
}

export interface GraphElements {
	elements: {
		nodes: Data[]
		edges: Edge[]
	}
}

export interface AdditionalProperties {
	controls?: string[]
	causal_graph?: GraphElements
	estimator_specs?: any
	model_specs?: AlternativeModelsReq[]
	refuter_specs?: any
}
