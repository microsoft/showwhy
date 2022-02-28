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
