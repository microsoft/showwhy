/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { hasAnyConstraint } from '../../components/lists/EdgeList.utils.js'
import type { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import {
	Relationship,
	RelationshipWithWeight,
} from '../../domain/Relationship.js'
import { correlationForVariables } from '../Correlation.js'
import type { ATEDetailsByName } from './../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { EdgeReportRow } from './../../domain/EdgeReportRow.js'
import { getCausalRelationship } from './reportUtils.js'

export class ReportGenerator {
	protected reportRows: EdgeReportRow[]

	constructor() {
		this.reportRows = []
	}

	generateReport(
		causalRelationships: Relationship[],
		selectedCausalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		correlations: RelationshipWithWeight[],
		constraints?: CausalDiscoveryConstraints,
		ATEDetailsByName?: ATEDetailsByName,
	): EdgeReportRow[] {
		causalRelationships.forEach(relationship => {
			this.reportRows.push(
				this.generateRow(
					relationship,
					selectedCausalDiscoveryAlgorithm,
					correlations,
					constraints,
					ATEDetailsByName,
				),
			)
		})
		const allCorrelations = this.generateCorrelations(
			causalRelationships,
			correlations,
		).sort((a, b) => a.source.localeCompare(b.source))
		this.reportRows.push(...allCorrelations)

		return this.reportRows
	}

	generateCorrelations(
		causalRelationships: Relationship[],
		correlations: RelationshipWithWeight[],
	): EdgeReportRow[] {
		const allSources = new Set(
			causalRelationships.map(({ source }) => source.columnName),
		)
		const allTargets = new Set(
			causalRelationships.map(({ target }) => target.columnName),
		)
		const allColumns = new Set([...allSources, ...allTargets])
		return correlations
			.filter(
				({ source, target }) =>
					allColumns.has(source.columnName) ||
					allColumns.has(target.columnName),
			)
			.map(
				({ source, target, weight = 0 }) =>
					({
						source: source.columnName,
						target: target.columnName,
						correlation: weight.toFixed(3),
					} as EdgeReportRow),
			)
	}

	generateRow(
		relationship: Relationship,
		selectedCausalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		correlations: RelationshipWithWeight[],
		constraints?: CausalDiscoveryConstraints,
		ATEDetailsByName?: ATEDetailsByName,
	): EdgeReportRow {
		const hasConstraints = hasAnyConstraint(relationship, constraints)
		const correlation = correlationForVariables(
			correlations,
			relationship.source,
			relationship.target,
		)

		return {
			source: relationship.source.columnName,
			target: relationship.target.columnName,
			correlation: correlation?.weight?.toFixed(3),
			is_constrained: hasConstraints ? 1 : 0,
			method: selectedCausalDiscoveryAlgorithm,
			relationship: getCausalRelationship(relationship?.weight),
			weight: relationship.weight?.toFixed(3),
			weight_formula: 'causal effect weight (float)',
			source_reference: undefined,
			source_treated: undefined,
			target_ate: undefined,
		}
	}
}
