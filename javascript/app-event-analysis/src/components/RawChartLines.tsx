/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'

import { useTreatedUnitsMap } from '../hooks/useTreatedUnitsMap.js'
import { Line } from './Line.js'
import { useLinePropsGetters } from './RawChartLines.hooks.js'
import type { RawChartLinesProps } from './RawChartLines.types.js'

export const RawChartLines: React.FC<RawChartLinesProps> = memo(
	function RawChartLines({
		xScale,
		yScale,
		treatedUnits,
		lineChartData,
		mouseHandlers,
	}) {
		const treatedUnitsMap = useTreatedUnitsMap(treatedUnits)
		const { handleLineMouseMove, handleLineMouseLeave, handleLineMouseClick } =
			mouseHandlers
		const { getClassName, getOpacity, getStrokeWidth, getColor } =
			useLinePropsGetters(treatedUnitsMap)
		const { inputLines } = lineChartData

		return inputLines.map((ld, index) => (
			<Line
				key={index}
				className={getClassName(ld)}
				color={getColor(ld)}
				xScale={xScale}
				yScale={yScale}
				data={ld}
				opacity={getOpacity(ld)}
				strokeWidth={getStrokeWidth(ld)}
				onMouseMove={handleLineMouseMove}
				onMouseLeave={handleLineMouseLeave}
				onClick={handleLineMouseClick}
			/>
		))
	},
)
