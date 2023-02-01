/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'

import { useTreatedUnitsMap } from '../hooks/useTreatedUnitsMap.js'
import { Line } from './Line.js'
import {
	useLinePropsGetters,
	useOutputLinesIncludingMean,
} from './SyntheticChartLines.hooks.js'
import type { SyntheticChartLinesProps } from './SyntheticChartLines.types.js'

export const SyntheticChartLines: React.FC<SyntheticChartLinesProps> = memo(
	function SyntheticChartLines({ xScale, yScale, mouseHandlers, ...props }) {
		const { isPlaceboSimulation, showMeanTreatmentEffect, treatedUnits } = props
		const treatedUnitsMap = useTreatedUnitsMap(treatedUnits)
		const { handleLineMouseMove, handleLineMouseLeave, handleLineMouseClick } =
			mouseHandlers
		const outputLinesIncludingMean = useOutputLinesIncludingMean(props)
		const {
			getClassName,
			getColor,
			getOpacity,
			getStrokeWidth,
			getStrokeDasharray,
		} = useLinePropsGetters({
			treatedUnits,
			isPlaceboSimulation,
			showMeanTreatmentEffect,
			treatedUnitsMap,
		})

		return (
			<>
				{outputLinesIncludingMean.map((ld, index) => (
					<Line
						key={`${ld[0]?.unit}@${index}`}
						xScale={xScale}
						yScale={yScale}
						data={ld}
						className={getClassName(ld)}
						color={getColor(ld)}
						opacity={getOpacity(ld)}
						strokeWidth={getStrokeWidth(ld)}
						strokeDasharray={getStrokeDasharray(ld)}
						onMouseMove={handleLineMouseMove}
						onMouseLeave={handleLineMouseLeave}
						onClick={handleLineMouseClick}
					/>
				))}
			</>
		)
	},
)
