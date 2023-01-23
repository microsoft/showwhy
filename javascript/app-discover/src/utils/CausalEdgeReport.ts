/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { hasAnyConstraint } from '../components/lists/EdgeList.utils.js'
import { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from '../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { CausalEdgesReport } from '../domain/CausalEdgesReport.js'
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
): CausalEdgesReport {
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
		isConstrained: !isPC && hasConstraints ? 1 : 0,
		method: selectedCausalDiscoveryAlgorithm,
		relationship: getCausalRelationship(
			selectedCausalDiscoveryAlgorithm,
			relationship?.weight,
		),
		weight: relationship.weight?.toFixed(3),
		weightMeaning: getWeightMeaning(selectedCausalDiscoveryAlgorithm),
		sourceReferenceValue: !isNatureCategorical ? ate?.reference : undefined,
		sourceTreatedValue: !isNatureCategorical ? ate?.intervention : undefined,
		targetAverageTreatmentEffect:
			ate && !isNatureCategorical ? relationship?.weight : undefined,
	}
}

function getCausalRelationship(
	selectedCausalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
	weight = 0,
) {
	return selectedCausalDiscoveryAlgorithm === CausalDiscoveryAlgorithm.PC
		? 'Causes change'
		: weight > 0
		? 'Causes increase'
		: 'Causes decrease'
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
			meaning = 'whether the edge exist or not (0 or 1)'
			break
		case CausalDiscoveryAlgorithm.DECI:
			meaning = 'edge confidence (between 0 and 1)'
			break
	}
	return meaning
}
