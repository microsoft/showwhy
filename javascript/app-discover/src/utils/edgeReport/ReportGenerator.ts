/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { hasAnyConstraint } from '../../components/lists/EdgeList.utils.js'
import type { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { CausalVariable } from '../../domain/CausalVariable.js'
import type {
	Relationship,
	RelationshipWithWeight,
} from '../../domain/Relationship.js'
import {
	arrayIncludesRelationship,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'
import { correlationForVariables } from '../Correlation.js'
import type { ATEDetailsByName } from './../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { EdgeReportRow } from './../../domain/EdgeReportRow.js'
import { getCausalRelationship } from './reportUtils.js'

export class ReportGenerator {
	protected reportRows: EdgeReportRow[] = []
	protected allVariables: string[] = []

	getReportRows(
		relationships: Relationship[],
		selectedCausalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		correlations: RelationshipWithWeight[],
		constraints?: CausalDiscoveryConstraints,
		variables?: CausalVariable[],
		ATEDetailsByName?: ATEDetailsByName,
	): EdgeReportRow[] {
		this.allVariables = variables?.map((v) => v.columnName) || []
		this.addRelationshipRows(
			relationships,
			selectedCausalDiscoveryAlgorithm,
			correlations,
			constraints,
			ATEDetailsByName,
		)

		this.addRemovedRelationships(selectedCausalDiscoveryAlgorithm, constraints)
		this.addSavedNotFoundRelationships(
			selectedCausalDiscoveryAlgorithm,
			relationships,
			constraints,
		)
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
		causalRelationships.forEach((relationship) => {
			this.reportRows.push(
				this.getRelationshipRow(
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
		const removedRelationships = this.getRemovedRelationshipsRows(
			causalDiscoveryAlgorithm,
			constraints,
		).sort((a, b) => a.source.localeCompare(b.source))
		this.reportRows.push(...removedRelationships)
	}

	addSavedNotFoundRelationships(
		causalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		relationships: Relationship[],
		constraints?: CausalDiscoveryConstraints,
	) {
		const removedRelationships = this.getSavedNotFoundRelationshipsRows(
			causalDiscoveryAlgorithm,
			relationships,
			constraints,
		).sort((a, b) => a.source.localeCompare(b.source))
		this.reportRows.push(...removedRelationships)
	}

	addCorrelations(correlations: RelationshipWithWeight[]) {
		const allCorrelations = this.getCorrelationRows(correlations).sort(
			(a, b) => a.source.localeCompare(b.source),
		)
		this.reportRows.push(...allCorrelations)
	}

	getRemovedRelationshipsRows(
		causalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		constraints?: CausalDiscoveryConstraints,
	): EdgeReportRow[] {
		if (!constraints) return []
		const removedRelationships: EdgeReportRow[] = []
		constraints.manualRelationships.forEach((constraint) => {
			if (
				constraint.reason === ManualRelationshipReason.Removed &&
				(this.allVariables.includes(constraint.source.columnName) ||
					this.allVariables.includes(constraint.target.columnName))
			) {
				removedRelationships.push({
					source: constraint.source.columnName,
					target: constraint.target.columnName,
					method: causalDiscoveryAlgorithm,
					is_constrained: 1,
					is_discovered: 0,
					relationship: 'removed',
				} as EdgeReportRow)
			}
		})
		return removedRelationships
	}

	getSavedNotFoundRelationshipsRows(
		causalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		relationships: Relationship[],
		constraints?: CausalDiscoveryConstraints,
	): EdgeReportRow[] {
		if (!constraints) return []
		const removedRelationships: EdgeReportRow[] = []
		constraints.manualRelationships.forEach((constraint) => {
			if (
				constraint.reason === ManualRelationshipReason.Saved &&
				!arrayIncludesRelationship(relationships, constraint) &&
				(this.allVariables.includes(constraint.source.columnName) ||
					this.allVariables.includes(constraint.target.columnName))
			) {
				removedRelationships.push({
					source: constraint.source.columnName,
					target: constraint.target.columnName,
					method: causalDiscoveryAlgorithm,
					is_constrained: 1,
					is_discovered: 0,
					relationship: 'saved',
				} as EdgeReportRow)
			}
		})
		return removedRelationships
	}

	getCorrelationRows(correlations: RelationshipWithWeight[]): EdgeReportRow[] {
		return correlations
			.filter(
				({ source, target }) =>
					this.allVariables.includes(source.columnName) ||
					this.allVariables.includes(target.columnName),
			)
			.map(
				({ source, target, weight = 0 }) =>
					({
						source: source.columnName,
						target: target.columnName,
						correlation: weight.toFixed(3),
						is_constrained: 0,
						is_discovered: 0,
					}) as EdgeReportRow,
			)
	}

	getRelationshipRow(
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
			is_discovered: 1,
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
