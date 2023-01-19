/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalDiscoveryAlgorithm } from './CausalDiscovery/CausalDiscoveryAlgorithm.js'

export interface CausalEdgesReport {
	source: string
	target: string
	correlation?: string
	priorCausalKnowledge: Number
	discoveredCausalRelationship: Number
	causalMethod: CausalDiscoveryAlgorithm
	causalRelationship: string
	weight?: Number
	weightMeaning: string
	sourceReferenceValue: string
	sourceTreatedValue: string
	targetAverageTreatmentEffect: string
}
