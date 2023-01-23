/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { download } from '@datashaper/utilities'
import * as aq from 'arquero'
import { useCallback } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import type { Relationship } from '../../domain/Relationship.js'
import { row2report } from '../../utils/CausalEdgeReport.js'
import {
	CausalDiscoveryResultsState,
	CausalGraphConstraintsState,
} from '../atoms/causal_graph.js'
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
	const ate = useRecoilValue(CausalDiscoveryResultsState).graph.ateDetailsByName
	return useCallback(() => {
		const formattedRows = causalRelationships.flatMap(relationship => {
			return row2report(
				relationship,
				selectedCausalDiscoveryAlgorithm,
				constraints,
				correlations,
				ate,
			)
		})

		const table = aq.from(formattedRows)
		const blob = new Blob([table.toCSV()])
		download(`edges-${new Date().toLocaleString()}.csv`, 'text/csv', blob)
	}, [
		correlations,
		selectedCausalDiscoveryAlgorithm,
		constraints,
		ate,
		causalRelationships,
	])
}
