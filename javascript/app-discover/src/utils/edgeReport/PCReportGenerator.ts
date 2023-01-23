/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import { EdgeReportRow } from '../../domain/EdgeReportRow'
import {
	Relationship,
	RelationshipWithWeight,
} from '../../domain/Relationship.js'
import { correlationForVariables } from '../Correlation.js'
import { ReportGenerator } from './ReportGenerator.js'

export class PCReportGenerator extends ReportGenerator {
	constructor() {
		super()
	}

	generateRow(
		relationship: Relationship,
		selectedCausalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		correlations: RelationshipWithWeight[],
	): EdgeReportRow {
		const correlation = correlationForVariables(
			correlations,
			relationship.source,
			relationship.target,
		)
		return {
			source: relationship.source.columnName,
			target: relationship.target.columnName,
			correlation: correlation?.weight?.toFixed(3),
			is_constrained: 0,
			method: selectedCausalDiscoveryAlgorithm,
			relationship: 'changes',
			weight: relationship.weight?.toFixed(3),
			weight_formula: 'edge existence (0 or 1)',
			source_reference: undefined,
			source_treated: undefined,
			target_ate: undefined,
		}
	}
	public getReport() {
		return this.reportRow
	}
}
