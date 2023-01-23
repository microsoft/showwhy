/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { hasAnyConstraint } from '../../components/lists/EdgeList.utils.js'
import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import {
	Relationship,
	RelationshipWithWeight,
} from '../../domain/Relationship.js'
import { correlationForVariables } from '../Correlation.js'
import type { ATEDetailsByName } from './../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import { EdgeReportRow } from './../../domain/EdgeReportRow'
import { getCausalRelationship } from './CausalEdgeReport.js'

export class ReportGenerator {
	protected reportRow: EdgeReportRow[]

	constructor() {
		this.reportRow = []
	}

	generateReport(
		causalRelationships: Relationship[],
		selectedCausalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		correlations: RelationshipWithWeight[],
		constraints?: CausalDiscoveryConstraints,
		ATEDetailsByName?: ATEDetailsByName,
	) {
		causalRelationships.flatMap(relationship => {
			this.reportRow.push(
				this.generateRow(
					relationship,
					selectedCausalDiscoveryAlgorithm,
					correlations,
					constraints,
				),
			)
		})
	}

	generateRow(
		relationship: Relationship,
		selectedCausalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		correlations: RelationshipWithWeight[],
		constraints?: CausalDiscoveryConstraints,
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
