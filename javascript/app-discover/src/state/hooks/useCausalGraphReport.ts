/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { download } from '@datashaper/utilities'
import * as aq from 'arquero'
import { useCallback } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

import type { CausalGraph } from '../../domain/Graph.js'
import * as Graph from '../../domain/Graph.js'
import { reportFactory } from '../../utils/edgeReport/ReportFactory.js'
import {
	CausalDiscoveryResultsState,
	CausalGraphConstraintsState,
} from '../atoms/causal_graph.js'
import {
	ConfidenceThresholdState,
	SelectedCausalDiscoveryAlgorithmState,
	WeightThresholdState,
} from '../atoms/ui.js'
import { FilteredCorrelationsState } from '../selectors/correlations.js'

export function useDownloadGraph(causalGraph: CausalGraph): () => void {
	const weightThreshold = useRecoilValue(WeightThresholdState)
	const confidenceThreshold = useRecoilValue(ConfidenceThresholdState)
	const relationships = Graph.relationshipsAboveThresholds(
		causalGraph,
		weightThreshold,
		confidenceThreshold,
	)
	const correlations =
		useRecoilValueLoadable(FilteredCorrelationsState).valueMaybe() || []
	const selectedCausalDiscoveryAlgorithm = useRecoilValue(
		SelectedCausalDiscoveryAlgorithmState,
	)
	const constraints = useRecoilValue(CausalGraphConstraintsState)
	const ate = useRecoilValue(CausalDiscoveryResultsState).graph.ateDetailsByName
	return useCallback(() => {
		const report = reportFactory(
			selectedCausalDiscoveryAlgorithm,
		).getReportRows(
			relationships,
			selectedCausalDiscoveryAlgorithm,
			correlations,
			constraints,
			causalGraph.variables,
			ate,
		)

		const table = aq.from(report)
		const blob = new Blob([table.toCSV()])
		download(
			`causal-graph-${new Date().toISOString().slice(0, 10)}.csv`,
			'text/csv',
			blob,
		)
	}, [
		correlations,
		selectedCausalDiscoveryAlgorithm,
		constraints,
		ate,
		causalGraph,
		relationships,
	])
}
