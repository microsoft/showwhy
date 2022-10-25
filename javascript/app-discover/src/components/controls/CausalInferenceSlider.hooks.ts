/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import {
	CausalInferenceBaselineValuesState,
	CausalInferenceResultState,
} from '../../state/index.js'

export function useCausalInferenceDifferenceFromBaselineValues() {
	const baselines = useRecoilValue(CausalInferenceBaselineValuesState)
	const inferredValues = useRecoilValue(CausalInferenceResultState)
	const differences = new Map<string, number>()
	Array.from(baselines.keys()).forEach(columnName => {
		const baseline = baselines.get(columnName)
		const inferredValue = inferredValues.get(columnName)
		if (baseline !== undefined && inferredValue !== undefined) {
			differences.set(columnName, inferredValue - baseline)
		}
	})
	return differences
}

export function useInferenceResult(columnName: string): number | undefined {
	const causalInferenceResults = useRecoilValue(CausalInferenceResultState)
	return useMemo((): number | undefined => {
		return causalInferenceResults.get(columnName)
	}, [causalInferenceResults])
}
