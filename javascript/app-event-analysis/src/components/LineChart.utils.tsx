/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { bisector } from 'd3'

import type { LineData } from '../types'

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
