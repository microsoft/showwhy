/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Hypothesis } from '@showwhy/app-common'
import { useThematic } from '@thematic/react'
import { useCallback } from 'react'

import {
	useCheckedUnitsValueState,
	useHypothesisValueState,
} from '../../state/index.js'
import type {
	BarData,
	PlaceboDataGroup,
	PlaceboOutputData,
} from '../../types.js'
import {
	getSdidEstimate,
	getTreatedPlaceboIndex,
} from './PlaceboResult.utils.js'

export function useGetPlaceboResults() {
	const hypothesis = useHypothesisValueState()

	return useCallback(
		(
			treatedPlaceboP: number,
			causalEffect: number,
			treatedUnit: string,
		): string => {
			const p = 0.05
			const isSignificant = treatedPlaceboP <= p
			const isChangedHypothesis = hypothesis === Hypothesis.Change
			const isIncreasedHypothesis = hypothesis === Hypothesis.Increase
			const isDecreasedHypothesis = hypothesis === Hypothesis.Decrease
			const increasedHypothesisIsNotConsistent =
				isIncreasedHypothesis && causalEffect < 0
			const decreasedHypothesisIsNotConsistent =
				isDecreasedHypothesis && causalEffect >= 0
			const increasedHypothesisIsConsistent =
				isIncreasedHypothesis && causalEffect >= 0
			const decreasedHypothesisIsConsistent =
				isDecreasedHypothesis && causalEffect < 0
			const isHypothesisNotConsistent =
				increasedHypothesisIsNotConsistent || decreasedHypothesisIsNotConsistent
			const isHypothesisConsistent =
				isChangedHypothesis ||
				increasedHypothesisIsConsistent ||
				decreasedHypothesisIsConsistent

			if (isHypothesisNotConsistent) {
				return `No. The observed causal effect (${causalEffect}) for ${treatedUnit} is inconsistent with the hypothesis (it did not cause it to ${
					isIncreasedHypothesis ? 'increase' : 'decrease'
				})`
			}
			if (isHypothesisConsistent && !isSignificant) {
				return `Maybe. The observed causal effect (${causalEffect}) for ${treatedUnit} is consistent with the hypothesis but the result is not statistically significant at the 5% level with respect to placebo effects (p=${treatedPlaceboP})`
			}
			if (isHypothesisConsistent && isSignificant) {
				return `Yes. The observed causal effect (${causalEffect}) for ${treatedUnit} is consistent with the hypothesis and the result is statistically significant at the 5% level with respect to placebo effects (p=${treatedPlaceboP})`
			}
			return ''
		},
		[hypothesis],
	)
}

export function useGetTreatedPlaceboP() {
	const checkedUnits = useCheckedUnitsValueState()
	return useCallback(
		(treatedUnit: string, placeboBarChartInputData: BarData[]): number => {
			const treatedPlaceboIndex = getTreatedPlaceboIndex(
				treatedUnit,
				placeboBarChartInputData,
			)
			return parseFloat(
				(treatedPlaceboIndex / (checkedUnits?.size ?? 1)).toFixed(3),
			)
		},
		[checkedUnits],
	)
}

export function useGetPlaceboBarChartInputData() {
	const theme = useThematic()

	return useCallback(
		(
			placeboDataGroup: PlaceboDataGroup[],
			output?: PlaceboOutputData,
		): BarData[] => {
			const inputData = placeboDataGroup.map(placebo => {
				const sdidEstimate = output ? getSdidEstimate(placebo.unit, output) : 0
				const direction = sdidEstimate < 0 ? -1 : 1
				const scale = theme.scales().nominal()
				return {
					name: placebo.unit,
					value: placebo.frequency,
					label: placebo.ratio * direction,
					color:
						direction === 1 ? theme.process().fill().hex() : scale(2).hex(),
				}
			})
			return inputData.sort((a, b) => a.value - b.value)
		},
		[theme],
	)
}
