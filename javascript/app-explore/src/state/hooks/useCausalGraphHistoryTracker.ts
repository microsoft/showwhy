/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { CausalGraphHistoryState } from '../atoms/index.js'
import { useCausalGraph } from './useCausalGraph.js'

// Component to track causal graph history using the pattern outlined here:
// https://github.com/facebookexperimental/Recoil/issues/485#issuecomment-660519295
export function useCausalGraphHistoryTracker() {
	const currentCausalGraph = useCausalGraph()
	const [causalGraphHistory, setCausalGraphHistory] = useRecoilState(
		CausalGraphHistoryState,
	)
	useEffect(
		() => setCausalGraphHistory([...causalGraphHistory, currentCausalGraph]),
		// this causes infinite render if we have complete deps
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
		[currentCausalGraph],
	)
}
