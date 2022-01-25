/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { AlternativeModelsRequest } from './api/AlternativeModelsRequest'
import { Graph } from './graphs'

export interface AdditionalProperties {
	controls?: string[]
	causal_graph?: Graph
	estimator_specs?: any
	model_specs?: AlternativeModelsRequest[]
	refuter_specs?: any
}
