/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CausalVariable } from '../../domain/CausalVariable.js'
import type { Relationship } from '../../domain/Relationship.js'

export interface CorrelationListProps {
	correlations: Relationship[]
	toColumnName?: string
	showGraph: boolean
}

export interface VariableCorrelationsListProps {
	variable: CausalVariable
}
