/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalDiscoveryAlgorithm } from './CausalDiscovery/CausalDiscoveryAlgorithm.js'

export interface EdgeReportRow {
	source: string
	target: string
	correlation?: string
	is_constrained?: Number
	method?: CausalDiscoveryAlgorithm
	relationship?: string
	weight?: string
	weight_formula?: string
	source_reference?: number | string
	source_treated?: number | string
	target_ate?: number
}
