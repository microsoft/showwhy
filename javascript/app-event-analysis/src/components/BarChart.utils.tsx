/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BarData } from '../types'

export function getColor(val: string | undefined) {
	switch (val) {
		case 'highlight':
			return 'blue'
		case 'control-units':
			return '#d22d54'
		case 'normal':
			return 'gray'
		default:
			return 'gray'
	}
}

export function constructBarTooltipContent(data: BarData) {
	return {
		content: (
			<>
				{data.name}
				<br />
				{data.label !== undefined
					? (data.label as number).toFixed(2)
					: data.value.toFixed(3)}
			</>
		),
		unit: data.name,
	}
}
