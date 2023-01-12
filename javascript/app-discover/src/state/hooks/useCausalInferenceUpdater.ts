/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { useInterventionModelId } from '../../components/graph/CausalGraphNode.hooks.js'
import type { Intervention } from '../../domain/CausalInference.js'
import {
	CausalInferenceBaselineValuesState,
	CausalInferenceResultState,
	CausalInterventionsState,
	ConfidenceThresholdState,
	ErrorMessageState,
	WeightThresholdState,
} from '../atoms/index.js'
import { useDebounceRunInference } from './useDebounceRunInference.js'

function interventionsToMap(
	interventions: Intervention[],
): Map<string, number> {
	const interventionsMap = new Map()

	interventions.forEach(i => {
		interventionsMap.set(i.columnName, i.value)
	})
	return interventionsMap
}

/**
 * Hook to update initial causal inference results after causal discovery is run
 */
export function useCausalInferenceUpdater() {
	const interventionModelId = useInterventionModelId()
	const weightThreshold = useRecoilValue(WeightThresholdState)
	const confidenceThreshold = useRecoilValue(ConfidenceThresholdState)
	const setInitialValues = useSetRecoilState(CausalInferenceBaselineValuesState)
	const interventions = useRecoilValue(CausalInterventionsState)
	const setCausalInferenceResults = useSetRecoilState(
		CausalInferenceResultState,
	)
	const debounceRunInference = useDebounceRunInference(500)
	const setErrorMessage = useSetRecoilState(ErrorMessageState)

	useEffect(() => {
		if (interventionModelId) {
			// setting the initial intervention values here, so the sliders
			// are responsive and we don't wait for the intervention
			// logic to finish to cause the moved slider to update
			setCausalInferenceResults(interventionsToMap(interventions))

			void debounceRunInference(
				interventionModelId,
				confidenceThreshold,
				weightThreshold,
				interventions,
				setInitialValues,
				setCausalInferenceResults,
				setErrorMessage,
			)
		}
	}, [
		debounceRunInference,
		interventionModelId,
		confidenceThreshold,
		weightThreshold,
		interventions,
		setCausalInferenceResults,
		setInitialValues,
		setErrorMessage,
	])
}
