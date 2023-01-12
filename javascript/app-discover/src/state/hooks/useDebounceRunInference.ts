/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDebounceFn } from 'ahooks'
import type { SetterOrUpdater } from 'recoil'

import type { Intervention } from '../../domain/CausalInference.js'
import { runCausalInference } from '../../domain/CausalInference.js'

export type DebounceRunInferenceFn = (
	interventionModelId: string,
	confidenceThreshold: number,
	weightThreshold: number,
	interventions: Intervention[],
	setInitialValues: SetterOrUpdater<Map<string, number>>,
	setCausalInferenceResults: SetterOrUpdater<Map<string, number>>,
	setErrorMessage: SetterOrUpdater<string | undefined>,
) => Promise<void>

export function useDebounceRunInference(wait: number): DebounceRunInferenceFn {
	const debounceRunInference = useDebounceFn(
		async (
			interventionModelId: string,
			confidenceThreshold: number,
			weightThreshold: number,
			interventions: Intervention[],
			setInitialValues: SetterOrUpdater<Map<string, number>>,
			setCausalInferenceResults: SetterOrUpdater<Map<string, number>>,
			setErrorMessage: SetterOrUpdater<string | undefined>,
		) => {
			setErrorMessage(undefined)

			try {
				const results = await runCausalInference(
					interventionModelId,
					confidenceThreshold,
					weightThreshold,
					interventions,
				)
				setInitialValues(results.baseline)
				setCausalInferenceResults(results.intervention)
			} catch {
				setErrorMessage('Something went wrong performing intervention')
			}
		},
		{ wait },
	)

	return debounceRunInference.run
}
