/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import type { Intervention } from '../../domain/CausalInference.js'
import {
	CausalInferenceBaselineValuesState,
	CausalInferenceResultState,
	CausalInterventionsState,
} from '../../state/index.js'

export function useCausalInferenceDifferenceFromBaselineValues() {
	const baselines = useRecoilValue(CausalInferenceBaselineValuesState)
	const inferredValues = useRecoilValue(CausalInferenceResultState)
	const differences = new Map<string, number>()
	Array.from(baselines.keys()).forEach((columnName) => {
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
	}, [causalInferenceResults, columnName])
}
export function useDifferenceValue(columnName: string): string {
	const differenceValues = useCausalInferenceDifferenceFromBaselineValues()
	return useMemo((): string => {
		const rawDifferenceValue = differenceValues.get(columnName) || 0
		return rawDifferenceValue.toFixed(2)
	}, [differenceValues, columnName])
}

export function useOnUpdateInterventions(
	columnName: string,
	interventions: Intervention[],
): (value: number) => void {
	const setInterventions = useSetRecoilState(CausalInterventionsState)

	return useCallback(
		(value: number) => {
			const revisedInterventions = interventions.filter(
				(intervention) => intervention.columnName !== columnName,
			)
			revisedInterventions.push({
				columnName,
				value: value,
			})
			setInterventions(revisedInterventions)
		},
		[interventions, setInterventions, columnName],
	)
}

export function useOnRemoveInterventions(
	columnName: string,
	interventions: Intervention[],
	wasDragged?: boolean,
): () => void {
	const setInterventions = useSetRecoilState(CausalInterventionsState)
	return useCallback(() => {
		if (wasDragged) {
			return
		}
		setInterventions(
			interventions.filter(
				(intervention) => intervention.columnName !== columnName,
			),
		)
	}, [interventions, setInterventions, wasDragged, columnName])
}
