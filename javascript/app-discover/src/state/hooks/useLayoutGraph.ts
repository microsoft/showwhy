/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { layoutGraph } from '../../utils/Layout.js'
import {
	CausalDiscoveryResultsState,
	ConfidenceThresholdState,
	CurrentLayoutState,
	WeightThresholdState,
} from '../atoms/index.js'

export function useLayoutGraph() {
	const causalGraph = useRecoilValue(CausalDiscoveryResultsState)
	const weightThreshold = useRecoilValue(WeightThresholdState)
	const confidenceThreshold = useRecoilValue(ConfidenceThresholdState)
	const setCurrentLayout = useSetRecoilState(CurrentLayoutState)

	return useCallback(async () => {
		const layout = await layoutGraph(
			causalGraph.graph,
			weightThreshold,
			confidenceThreshold,
		)
		setCurrentLayout(layout)
	}, [causalGraph, weightThreshold, confidenceThreshold, setCurrentLayout])
}
