/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { VariableReference } from '../CausalVariable.js'
import type { Relationship } from '../Relationship.js'
import { involvesVariable } from '../Relationship.js'

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

export const updateConstraints = (
	constraints: CausalDiscoveryConstraints,
	variable: VariableReference,
	constraintType: Constraints,
) => {
	let { causes, effects } = constraints
	const { manualRelationships } = constraints
	const currentConstraintType = getConstraintType(constraints, variable)
	if (currentConstraintType === Constraints.Cause) {
		causes = removeConstraint(causes, variable)
	} else if (currentConstraintType === Constraints.Effect) {
		effects = removeConstraint(effects, variable)
	}

	if (constraintType === Constraints.Cause) {
		causes = addConstraint(causes, variable)
	} else if (constraintType === Constraints.Effect) {
		effects = addConstraint(effects, variable)
	}
	const filteredConstraints = {
		...constraints,
		manualRelationships: manualRelationships.filter(
			r => !involvesVariable(r, variable),
		),
	}

	return {
		...filteredConstraints,
		causes,
		effects,
	}
}

const addConstraint = (
	constraints: VariableReference[],
	variable: VariableReference,
) => [...constraints, variable]

const removeConstraint = (
	constraints: VariableReference[],
	variable: VariableReference,
) =>
	constraints.filter(
		constraint => constraint.columnName !== variable.columnName,
	)
