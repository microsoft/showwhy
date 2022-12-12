/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { uniq } from 'lodash'
import React, { memo } from 'react'

import { MAX_RENDERED_TREATED_UNITS } from '../types.js'
import { useLineColors } from '../utils/useColors.js'
import { useTreatmentDates } from './TreatmentMarkers.hooks.js'
import type { TreatmentMarkersProps } from './TreatmentMarkers.types.js'

const TREATMENT_LINE_WIDTH = 1.5

export const TreatmentMarkers: React.FC<TreatmentMarkersProps> = memo(
	function TreatmentMarkers({
		height,
		width,
		outputData,
		treatedUnits,
		xScale,
		showTreatmentStart,
		isPlaceboSimulation,
		treatmentStartDates,
	}) {
		const colors = useLineColors()

		const treatmentDates = useTreatmentDates(
			outputData,
			isPlaceboSimulation,
			treatmentStartDates,
		)
		if (!showTreatmentStart || treatmentDates.length === 0) return null

		// render one marker at each unique treated date
		// for each line marker, render a list of units treated at that date marker
		// render one background starting from the first treated date till the end
		const uniqueTreatedDates = uniq(treatmentDates)
		const treatedUnitsPerDate: { [key: number]: string[] } = {}
		treatedUnits.forEach((treatedUnit: string, index: number) => {
			const treatmentDate = treatmentDates[index]
			if (treatedUnitsPerDate[treatmentDate] === undefined)
				treatedUnitsPerDate[treatmentDate] = []
			treatedUnitsPerDate[treatmentDate].push(treatedUnit)
		})
		// due to scalability concerns,
		//  limit the number of rendered labels at any given treatment date
		uniqueTreatedDates.forEach(treatmentDate => {
			if (
				treatedUnitsPerDate[treatmentDate].length > MAX_RENDERED_TREATED_UNITS
			) {
				treatedUnitsPerDate[treatmentDate] = [
					'treated #: ' + treatedUnitsPerDate[treatmentDate].length.toString(),
				]
			}
		})
		return (
			<>
				{uniqueTreatedDates.map(treatedDate => {
					const treatedDateXPos = xScale(treatedDate)
					const marker = (
						<line
							stroke={colors.treatmentLine}
							x1={treatedDateXPos}
							x2={treatedDateXPos}
							y1={0}
							y2={height}
							strokeWidth={TREATMENT_LINE_WIDTH}
						/>
					)
					const labels = treatedUnitsPerDate[treatedDate].map(
						(treatedUnit, indx) => (
							<text
								key={treatedUnit}
								x={treatedDateXPos + 1}
								y={15 + indx * 20}
								opacity={0.5}
								cursor="default"
							>
								<title>{treatedUnit}</title>
								{treatedUnit}
							</text>
						),
					)
					return (
						<g key={treatedDate}>
							{marker}
							{labels}
						</g>
					)
				})}
				<rect
					width={width - xScale(treatmentDates[0])}
					height={height}
					x={xScale(treatmentDates[0])}
					opacity={0.03}
					fill={colors.treatmentLine}
					pointerEvents="none"
				/>
			</>
		)
	},
)
