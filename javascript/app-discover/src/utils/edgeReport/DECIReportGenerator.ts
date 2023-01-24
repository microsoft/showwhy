/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { hasAnyConstraint } from '../../components/lists/EdgeList.utils.js'
import type { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { ATEDetailsByName } from '../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { EdgeReportRow } from '../../domain/EdgeReportRow'
import type {
	Relationship,
	RelationshipWithWeight,
} from '../../domain/Relationship.js'
import { correlationForVariables } from '../Correlation.js'
import { ReportGenerator } from './ReportGenerator.js'
import { getCausalRelationship, isCategorical } from './reportUtils.js'

export class DECIReportGenerator extends ReportGenerator {
	getRelationshipRow(
		relationship: Relationship,
		selectedCausalDiscoveryAlgorithm: CausalDiscoveryAlgorithm,
		correlations: RelationshipWithWeight[],
		constraints: CausalDiscoveryConstraints,
		ATEDetailsByName?: ATEDetailsByName,
	): EdgeReportRow {
		const hasConstraints = hasAnyConstraint(relationship, constraints)
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
			is_constrained: hasConstraints ? 1 : 0,
			method: selectedCausalDiscoveryAlgorithm,
			relationship: getCausalRelationship(relationship?.weight),
			weight: relationship.weight?.toFixed(3),
			weight_formula: 'edge confidence (between 0 and 1)',
			source_reference: !isNatureCategorical ? ate?.reference : undefined,
			source_treated: !isNatureCategorical ? ate?.intervention : undefined,
			target_ate: !isNatureCategorical ? relationship?.weight : undefined,
		}
	}
}
