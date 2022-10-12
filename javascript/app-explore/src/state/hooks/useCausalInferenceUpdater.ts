/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { runCausalInference } from '../../domain/CausalInference.js'
import {
	CausalInferenceBaselineOffsetsState,
	CausalInferenceBaselineValuesState,
	CausalInferenceResultState,
	CausalInterventionsState,
	ConfidenceThresholdState,
	WeightThresholdState,
} from '../atoms/index.js'
import { InModelCausalVariablesState } from '../selectors/index.js'
import { useCausalInferenceModel } from './useCausalInferenceModel.js'

/**
 * Hook to update initial causal inference results after causal discovery is run
 */
export function useCausalInferenceUpdater() {
	const inModelVariables = useRecoilValue(InModelCausalVariablesState)
	const inferenceModel = useCausalInferenceModel()
	const weightThreshold = useRecoilValue(WeightThresholdState)
	const confidenceThreshold = useRecoilValue(ConfidenceThresholdState)
	const setInitialValues = useSetRecoilState(CausalInferenceBaselineValuesState)

	const initialValueOffsets = useRecoilValue(
		CausalInferenceBaselineOffsetsState,
	)
	const interventions = useRecoilValue(CausalInterventionsState)
	const setCausalInferenceResults = useSetRecoilState(
		CausalInferenceResultState,
	)

	useEffect(() => {
		if (inferenceModel) {
			const runInference = async () => {
				const baselineResults = await runCausalInference(
					inferenceModel,
					confidenceThreshold,
					weightThreshold,
					inModelVariables,
				)
				setInitialValues(baselineResults)
				const intervenedResults = await runCausalInference(
					inferenceModel,
					confidenceThreshold,
					weightThreshold,
					inModelVariables,
					initialValueOffsets,
					interventions,
				)
				setCausalInferenceResults(intervenedResults)
			}

			void runInference()
		}
	}, [
		inferenceModel,
		confidenceThreshold,
		weightThreshold,
		inModelVariables,
		interventions,
		initialValueOffsets,
		setCausalInferenceResults,
		setInitialValues,
	])
}
