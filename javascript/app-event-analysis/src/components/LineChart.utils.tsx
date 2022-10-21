/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Theme } from '@thematic/core'
import { bisector } from 'd3'

import type { LineData } from '../types'

export function getLineStroke(theme: Theme) {
	// use the main line props for primary line,
	// use the scales to extract secondary or tertiary colors
	// TODO: we need a secondary color in thematic so we don't need to use the nominal scale
	const scale = theme.scales().nominal()
	return {
		// return semantically named colors
		get: (name: string) => {
			switch (name) {
				case 'treated':
				case 'mean treated':
				case 'relative':
					return theme.line().stroke().hex()
				case 'synthetic control':
				case 'mean synthetic':
				case 'control':
				case 'reference':
					return scale(1).hex()
				default:
					return theme.text().fill().hex()
			}
		},
		// fixed static colors (e.g., chart chrome, etc.)
		defaultAxisTitle: theme.axisTitle().fill().hex(),
		arrowFill: theme.flow().stroke().hex(),
		arrowStroke: theme.flow().stroke().hex(),
		circleFill: theme.circle().fill().hex(),
		timeMarker: theme.process().fill().hex(),
		counterfactual: theme.link().stroke().hex(),
		gridLine: theme.gridLines().stroke().hex(),
		treatmentLine: scale(4).hex(),
		counterfactualLine: theme.link().stroke().hex(),
		control: theme.link().stroke().hex(),
	}
}

/* eslint-disable-next-line @typescript-eslint/unbound-method */
export const bisectRight = bisector((d: LineData) => d.date).right

export function constructLineTooltipContent(
	data: LineData[] | LineData[],
	date?: number,
) {
	if (date === undefined) {
		return { content: <>{data[0].unit}</>, unit: '' }
	}
	const closestElement = bisectRight(data, date)
	const d0 = data[closestElement - 1].date
	const d1 = closestElement >= data.length ? d0 : data[closestElement].date
	const finalDate = date - d0 > d1 - date ? d1 : d0
	const finalElement = data.find(ele => ele.date === finalDate)
	const finalValue =
		finalElement && finalElement.value !== null
			? finalElement.value.toFixed(2)
			: 'undefined'
	const unit = finalElement ? finalElement.unit : 'unknown unit'
	return {
		content: (
			<>
				{finalDate}
				<br />
				{finalValue}
				<br />
				{unit}
			</>
		),
		unit: unit,
	}
}
