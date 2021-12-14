/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { AlternativeModelsReq } from './AlternativeModels'

export interface DataObject {
	id: string
	value: string
	name: string
}

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

export interface EdgeObject {
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

export interface Model {
	type: string
	label: string
	require_propensity_score: boolean
	method_name: string
	method_params?: any
}

export interface AdditionalProperties {
	controls?: string[]
	causal_graph?: GraphElements
	estimator_specs?: any
	model_specs?: AlternativeModelsReq[]
	refuter_specs?: any
}

export interface Graph {
	graph?: GraphElements
	additional_properties?: AdditionalProperties
}

export interface SpecCount {
	spec_count: number
}
