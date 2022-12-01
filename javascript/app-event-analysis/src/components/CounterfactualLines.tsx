/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isEmpty } from 'lodash'
import React, { memo, useMemo } from 'react'
import { useLinesData } from './CounterfactualLines.hooks.js'
import { CounterfactualLinesProps } from './CounterfactualLines.types.js'

export const CounterfactualLines: React.FC<CounterfactualLinesProps> = memo(
	function CounterfactualLines({
		xScale,
		yScale,
		hoverUnit,
		outputData,
		renderRawData,
		applyIntercept,
		showSynthControl,
		relativeIntercept,
		isPlaceboSimulation,
	}) {
		const shouldReturnNull = useMemo<boolean>(() => {
			return (
				hoverUnit === '' ||
				outputData.length === 0 ||
				isEmpty(outputData[0]) ||
				relativeIntercept ||
				renderRawData ||
				isPlaceboSimulation
			)
		}, [
			hoverUnit,
			outputData,
			renderRawData,
			relativeIntercept,
			isPlaceboSimulation,
		])
		if (shouldReturnNull) return null

		const linesData = useLinesData(
			hoverUnit,
			xScale,
			yScale,
			outputData,
			applyIntercept,
			showSynthControl,
		)

		const lines = useMemo(
			() =>
				linesData.map((lineProps, index) => (
					<line key={index} {...lineProps} />
				)),
			[linesData],
		)

		return <g>{lines}</g>
	},
)
