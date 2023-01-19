/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { download } from '@datashaper/utilities'
import * as aq from 'arquero'
import { useCallback } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { hasAnyConstraint } from '../../components/lists/EdgeList.utils.js'
import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import { CausalEdgesReport } from '../../domain/CausalEdgesReport.js'
import { Relationship } from '../../domain/Relationship.js'
import { correlationForVariables } from '../../utils/Correlation.js'
import { CausalGraphConstraintsState } from '../atoms/causal_graph.js'
import { SelectedCausalDiscoveryAlgorithmState } from '../atoms/ui.js'
import { FilteredCorrelationsState } from '../selectors/correlations.js'
export function useDownloadEdges(
	causalRelationships: Relationship[],
): () => void {
	const correlations =
		useRecoilValueLoadable(FilteredCorrelationsState).valueMaybe() || []
	const [selectedCausalDiscoveryAlgorithm] = useRecoilState(
		SelectedCausalDiscoveryAlgorithmState,
	)
	const constraints = useRecoilValue(CausalGraphConstraintsState)
	return useCallback(() => {
		const formatted = causalRelationships.flatMap(relationship => {
			const correlation = correlationForVariables(
				correlations,
				relationship.source,
				relationship.target,
			)
			const hasConstraints = hasAnyConstraint(constraints, relationship)

			return {
				source: relationship.source.columnName,
				target: relationship.target.columnName,
				correlation: correlation?.weight?.toFixed(3),
				priorCausalKnowledge: hasConstraints ? 1 : 0,
				discoveredCausalRelationship: hasConstraints ? 0 : 1,
				causalMethod: selectedCausalDiscoveryAlgorithm,
				causalRelationship:
					selectedCausalDiscoveryAlgorithm === CausalDiscoveryAlgorithm.PC
						? 'Causes change'
						: relationship.weight ?? 0 > 0
						? 'Causes increase'
						: 'Causes decrease',
				weight: relationship.weight?.toFixed(3),
				weightMeaning: weightMeaning(selectedCausalDiscoveryAlgorithm),
				sourceReferenceValue: '',
				sourceTreatedValue: '',
				targetAverageTreatmentEffect: '',
			} as CausalEdgesReport
		})

		const table = aq.from(formatted)
		const blob = new Blob([table.toCSV()])
		download(`edges-${new Date().toLocaleString()}.csv`, 'text/csv', blob)
	}, [correlations, constraints, causalRelationships])
}

function weightMeaning(algorithm: CausalDiscoveryAlgorithm): string {
	let meaning = ''
	switch (algorithm) {
		case CausalDiscoveryAlgorithm.NOTEARS:
		case CausalDiscoveryAlgorithm.DirectLiNGAM:
			meaning = 'weight - causal effect (float - [-inf, inf])'
			break
		case CausalDiscoveryAlgorithm.PC:
			meaning = 'whether the edge exist or not (int - 0 or 1)'
			break
		case CausalDiscoveryAlgorithm.DECI:
			meaning = 'edge confidence (float - [0, 1])'
			break
	}
	return meaning
}
