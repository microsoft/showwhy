/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { hasAnyConstraint } from '../components/lists/EdgeList.utils.js'
import { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from '../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { EdgeReportRow } from '../domain/EdgeReportRow.js'
import { VariableNature } from '../domain/VariableNature.js'
import type { ATEDetailsByName } from './../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type {
	Relationship,
	RelationshipWithWeight,
} from './../domain/Relationship.js'
import { correlationForVariables } from './Correlation.js'

export function row2report(
	relationship: Relationship,
	selectedCausalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
	constraints: CausalDiscoveryConstraints,
	correlations: RelationshipWithWeight[],
	ATEDetailsByName?: ATEDetailsByName,
): EdgeReportRow {
	const hasConstraints = hasAnyConstraint(constraints, relationship)
	const isPC = selectedCausalDiscoveryAlgorithm === CausalDiscoveryAlgorithm.PC
	const correlation = correlationForVariables(
		correlations,
		relationship.source,
		relationship.target,
	)
	const ate =
		ATEDetailsByName && ATEDetailsByName[relationship?.source.columnName]
	const isNatureCategorical = isCategorical(ate?.nature)

	return {
		source: relationship.source.columnName,
		target: relationship.target.columnName,
		correlation: correlation?.weight?.toFixed(3),
		is_constrained: !isPC && hasConstraints ? 1 : 0,
		method: selectedCausalDiscoveryAlgorithm,
		relationship: getCausalRelationship(
			selectedCausalDiscoveryAlgorithm,
			relationship?.weight,
		),
		weight: relationship.weight?.toFixed(3),
		weight_formula: getWeightMeaning(selectedCausalDiscoveryAlgorithm),
		source_reference: !isNatureCategorical ? ate?.reference : undefined,
		source_treated: !isNatureCategorical ? ate?.intervention : undefined,
		target_ate: ate && !isNatureCategorical ? relationship?.weight : undefined,
	}
}

function getCausalRelationship(
	selectedCausalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
	weight = 0,
) {
	return selectedCausalDiscoveryAlgorithm === CausalDiscoveryAlgorithm.PC
		? 'changes'
		: weight > 0
		? 'increases'
		: 'decreases'
}

function isCategorical(nature?: VariableNature): boolean {
	return (
		nature === VariableNature.CategoricalNominal ||
		nature === VariableNature.CategoricalOrdinal
	)
}

function getWeightMeaning(algorithm: CausalDiscoveryAlgorithm): string {
	let meaning = ''
	switch (algorithm) {
		case CausalDiscoveryAlgorithm.NOTEARS:
		case CausalDiscoveryAlgorithm.DirectLiNGAM:
			meaning = 'causal effect weight (float)'
			break
		case CausalDiscoveryAlgorithm.PC:
			meaning = 'edge existence (0 or 1)'
			break
		case CausalDiscoveryAlgorithm.DECI:
			meaning = 'edge confidence (between 0 and 1)'
			break
	}
	return meaning
}
