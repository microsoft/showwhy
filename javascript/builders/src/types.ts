/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CausalityLevel } from '@showwhy/types'

export interface Spec {
	type: CausalityLevel
	label?: string
	variable?: string
}
export interface PopulationSpec {
	type: CausalityLevel
	label: string
	dataframe: string
	population_id?: string
}
