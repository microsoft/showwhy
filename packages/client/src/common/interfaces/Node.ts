/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RefutationType } from '~enums'
import {
	AdditionalProperties,
	GraphElements,
	DescribeElements,
	AlternativeModels,
	Estimator,
} from '~interfaces'

interface Node extends Partial<AdditionalProperties> {
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
	causal_graph?: GraphElements
}

export interface TotalExecutionsResponse {
	total_executions: number
}

export interface NodeResponse {
	id: string
	purgeHistoryDeleteUri: string
	restartPostUri: string
	rewindPostUri: string
	sendEventPostUri: string
	statusQueryGetUri: string
	terminatePostUri: string
}

export interface NodeRequest {
	session_id?: string
	nodes: Node[]
}

export interface NodeProperties {
	fileName?: string
	definitions: DescribeElements
	estimators: Estimator[]
	refutationType: RefutationType
	confidenceInterval: boolean
	maximumLevel: AlternativeModels
	minimumModel: AlternativeModels
	intermediateLevel: AlternativeModels
	unadjustedModel: AlternativeModels
}
