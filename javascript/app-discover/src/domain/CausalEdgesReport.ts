/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalDiscoveryAlgorithm } from './CausalDiscovery/CausalDiscoveryAlgorithm.js'

export interface CausalEdgesReport {
	source: string
	target: string
	correlation?: string
	priorCausalKnowledge: Number
	discoveredCausalRelationship: Number
	causalMethod: CausalDiscoveryAlgorithm
	causalRelationship: string
	weight?: string
	weightMeaning: string
	sourceReferenceValue: string
	sourceTreatedValue: string
	targetAverageTreatmentEffect: string
}
