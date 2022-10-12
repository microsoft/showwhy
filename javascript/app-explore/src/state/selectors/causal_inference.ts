/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { selector } from 'recoil'

import {
	CausalInferenceBaselineValuesState,
	CausalInferenceResultState,
} from '../atoms/index.js'

export const CausalInferenceDifferenceFromBaselineValuesState = selector<
	Map<string, number>
>({
	key: 'CausalInferenceDifferenceFromBaselineValuesState',
	get({ get }) {
		const baselines = get(CausalInferenceBaselineValuesState)
		const inferredValues = get(CausalInferenceResultState)
		const differences = new Map<string, number>()
		Array.from(baselines.keys()).forEach(columnName => {
			const baseline = baselines.get(columnName)
			const inferredValue = inferredValues.get(columnName)
			if (baseline !== undefined && inferredValue !== undefined) {
				differences.set(columnName, inferredValue - baseline)
			}
		})
		return differences
	},
})
