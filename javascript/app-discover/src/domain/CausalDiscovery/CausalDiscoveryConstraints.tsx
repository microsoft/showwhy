/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { VariableReference } from '../CausalVariable.js'
import type { Relationship } from '../Relationship.js'

export interface CausalDiscoveryConstraints {
	causes: VariableReference[]
	effects: VariableReference[]
	manualRelationships: Relationship[]
}

export enum Constraints {
	Cause = 'Cause',
	Effect = 'Effect',
	None = 'None',
}

export const getConstraintType = (
	constraints: CausalDiscoveryConstraints,
	variable: VariableReference,
) => {
	if (
		constraints.causes.some(
			constraint => constraint.columnName === variable.columnName,
		)
	) {
		return Constraints.Cause
	}

	if (
		constraints.effects.some(
			constraint => constraint.columnName === variable.columnName,
		)
	) {
		return Constraints.Effect
	}

	return Constraints.None
}
