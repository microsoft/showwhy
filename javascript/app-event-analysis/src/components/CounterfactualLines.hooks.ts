/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'
import { D3ScaleLinear, OutputData, PlaceboOutputData } from '../types.js'
import { useLineColors } from '../utils/useColors.js'
import { CounterFactualLineData } from './CounterfactualLines.types.js'

const CONTROL_LINE_WIDTH = 2

function useShowCounterfactualOnly(
	applyIntercept: boolean,
	showSynthControl: boolean,
) {
	return useMemo(
		() => showSynthControl && !applyIntercept,
		[showSynthControl, applyIntercept],
	)
}

function useShowTreatedAndCounterfactual(x1: number) {
	return useMemo(() => x1 > 0, [x1])
}

function useShowControlOnly(
	x1: number,
	applyIntercept: boolean,
	showSynthControl: boolean,
) {
	const showCounterfactualOnly = useShowCounterfactualOnly(
		applyIntercept,
		showSynthControl,
	)
	const showTreatedAndCounterfactual = useShowTreatedAndCounterfactual(x1)
	return useMemo(
		() => showCounterfactualOnly && showTreatedAndCounterfactual,
		[showCounterfactualOnly, showTreatedAndCounterfactual],
	)
}

function useOutputDataNonPlacebo(
	hoverUnit: string,
	outputData: (OutputData | PlaceboOutputData)[],
): OutputData {
	const outputIndex = outputData.findIndex(output =>
		hoverUnit.includes(output.treatedUnit),
	)
	const outputDataNonPlacebo = outputData[outputIndex] as OutputData
	return useMemo(() => outputDataNonPlacebo, [outputDataNonPlacebo])
}

function useX1(
	outputDataNonPlacebo: OutputData,
	xScale: D3ScaleLinear,
): number {
	return useMemo(
		() =>
			outputDataNonPlacebo &&
			outputDataNonPlacebo.time_before_intervention !== undefined
				? xScale(outputDataNonPlacebo.time_before_intervention)
				: 0,
		[outputDataNonPlacebo, xScale],
	)
}

function useX2(
	outputDataNonPlacebo: OutputData,
	xScale: D3ScaleLinear,
): number {
	return useMemo(
		() =>
			outputDataNonPlacebo &&
			outputDataNonPlacebo.time_after_intervention !== undefined
				? xScale(outputDataNonPlacebo.time_after_intervention)
				: 0,
		[outputDataNonPlacebo, xScale],
	)
}

export function useLinesData(
	hoverUnit: string,
	xScale: D3ScaleLinear,
	yScale: D3ScaleLinear,
	outputData: (OutputData | PlaceboOutputData)[],
	applyIntercept: boolean,
	showSynthControl: boolean,
): () => CounterFactualLineData[] {
	const colors = useLineColors()
	const outputDataNonPlacebo = useOutputDataNonPlacebo(hoverUnit, outputData)

	const x1 = useX1(outputDataNonPlacebo, xScale)
	const x2 = useX2(outputDataNonPlacebo, xScale)

	const showControlOnly = useShowControlOnly(
		x1,
		applyIntercept,
		showSynthControl,
	)
	const showCounterfactualOnly = useShowCounterfactualOnly(
		applyIntercept,
		showSynthControl,
	)
	const showTreatedAndCounterfactual = useShowTreatedAndCounterfactual(x1)

	return useCallback(() => {
		const lines: CounterFactualLineData[] = []
		const base: Pick<CounterFactualLineData, 'x1' | 'x2' | 'strokeWidth'> = {
			x1,
			x2,
			strokeWidth: CONTROL_LINE_WIDTH,
		}

		if (showControlOnly) {
			const line = {
				...base,
				y1: yScale(outputDataNonPlacebo.control_pre_value),
				y2: yScale(outputDataNonPlacebo.control_post_value),
				className: 'controlLine',
				stroke: colors.get('control'),
			}
			lines.push(line)
		} else if (showCounterfactualOnly) {
			let line
			if (showTreatedAndCounterfactual) {
				line = {
					...base,
					y1: yScale(outputDataNonPlacebo.control_pre_value),
					y2: yScale(outputDataNonPlacebo.treated_pre_value),
					className: 'counterfactualLine',
					stroke: colors.counterfactualLine,
					strokeDasharray: '6, 4',
				}
				lines.push(line)
			}
			line = {
				...base,
				y1: yScale(outputDataNonPlacebo.control_post_value),
				y2: yScale(outputDataNonPlacebo.counterfactual_value),
				className: 'counterfactualLine',
				stroke: colors.counterfactualLine,
				strokeDasharray: '6, 4',
			}
			lines.push(line)
		} else if (showTreatedAndCounterfactual) {
			let line: CounterFactualLineData = {
				...base,
				y1: yScale(outputDataNonPlacebo.treated_pre_value),
				y2: yScale(outputDataNonPlacebo.treated_post_value),
				className: 'treatedLine',
				stroke: colors.get('treated'),
			}
			lines.push(line)

			line = {
				...base,
				y1: yScale(outputDataNonPlacebo.treated_pre_value),
				y2: yScale(outputDataNonPlacebo.counterfactual_value),
				className: 'counterfactualLine',
				stroke: colors.counterfactualLine,
				strokeDasharray: '6, 4',
			}
			lines.push(line)
		}
		return lines
	}, [])
}