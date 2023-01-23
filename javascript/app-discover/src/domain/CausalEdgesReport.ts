/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalDiscoveryAlgorithm } from './CausalDiscovery/CausalDiscoveryAlgorithm.js'

export interface CausalEdgesReport {
	source: string
	target: string
	correlation?: string
	isConstrained: Number
	method: CausalDiscoveryAlgorithm
	relationship: string
	weight?: string
	weightMeaning: string
	sourceReferenceValue?: number | string
	sourceTreatedValue?: number | string
	targetAverageTreatmentEffect?: number
}
