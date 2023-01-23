/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { hasAnyConstraint } from '../../components/lists/EdgeList.utils.js'
import type { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type {
	Relationship,
	RelationshipWithWeight} from '../../domain/Relationship.js';
import {
	ManualRelationshipReason
} from '../../domain/Relationship.js'
import { correlationForVariables } from '../Correlation.js'
import type { ATEDetailsByName } from './../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { EdgeReportRow } from './../../domain/EdgeReportRow.js'
import { getCausalRelationship } from './reportUtils.js'

export class ReportGenerator {
	protected reportRows: EdgeReportRow[]
	protected allVariables: Set<string>

	constructor() {
		this.reportRows = []
		this.allVariables = new Set()
	}

	generateReport(
		relationships: Relationship[],
		selectedCausalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		correlations: RelationshipWithWeight[],
		constraints?: CausalDiscoveryConstraints,
		ATEDetailsByName?: ATEDetailsByName,
	): EdgeReportRow[] {
		this.getAllVariables(relationships)
		this.addRelationshipRows(
			relationships,
			selectedCausalDiscoveryAlgorithm,
			correlations,
			constraints,
			ATEDetailsByName,
		)

		this.addRemovedRelationships(selectedCausalDiscoveryAlgorithm, constraints)
		this.addCorrelations(correlations)
		return this.reportRows
	}

	addRelationshipRows(
		causalRelationships: Relationship[],
		selectedCausalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		correlations: RelationshipWithWeight[],
		constraints?: CausalDiscoveryConstraints,
		ATEDetailsByName?: ATEDetailsByName,
	) {
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
	}

	addRemovedRelationships(
		causalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		constraints?: CausalDiscoveryConstraints,
	) {
		const removedRelationships = this.generateRemovedRelationships(
			causalDiscoveryAlgorithm,
			constraints,
		).sort((a, b) => a.source.localeCompare(b.source))
		this.reportRows.push(...removedRelationships)
	}

	addCorrelations(correlations: RelationshipWithWeight[]) {
		const allCorrelations = this.generateCorrelations(correlations).sort(
			(a, b) => a.source.localeCompare(b.source),
		)
		this.reportRows.push(...allCorrelations)
	}

	getAllVariables(causalRelationships: Relationship[]) {
		const allSources = new Set(
			causalRelationships.map(({ source }) => source.columnName),
		)
		const allTargets = new Set(
			causalRelationships.map(({ target }) => target.columnName),
		)
		this.allVariables = new Set([...allSources, ...allTargets])
	}

	generateRemovedRelationships(
		causalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		constraints?: CausalDiscoveryConstraints,
	): EdgeReportRow[] {
		if (!constraints) return []
		const removedRelationships: EdgeReportRow[] = []
		constraints.manualRelationships.forEach(constraint => {
			if (
				constraint.reason === ManualRelationshipReason.Removed &&
				(this.allVariables.has(constraint.source.columnName) ||
					this.allVariables.has(constraint.target.columnName))
			) {
				removedRelationships.push({
					source: constraint.source.columnName,
					target: constraint.target.columnName,
					method: causalDiscoveryAlgorithm,
					is_constrained: 1,
					relationship: 'removed',
				} as EdgeReportRow)
			}
		})
		return removedRelationships
	}

	generateCorrelations(
		correlations: RelationshipWithWeight[],
	): EdgeReportRow[] {
		return correlations
			.filter(
				({ source, target }) =>
					this.allVariables.has(source.columnName) ||
					this.allVariables.has(target.columnName),
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
