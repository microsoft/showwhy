/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Theme } from '@thematic/core'
import { SelectionState } from '@thematic/core'

import type { BarData } from '../types'

export function getColor(theme: Theme) {
	const scale = theme.scales().nominal()
	return {
		get: (name: string) => {
			switch (name) {
				case 'highlight':
					return theme
						.rect({ selectionState: SelectionState.Selected })
						.fill()
						.hex()
				case 'control-units':
					return scale(2).hex()
				case 'negative':
					return scale(1).hex()
				case 'normal':
				default:
					return theme.process().fill().hex()
			}
		},
		defaultAxisTitle: theme.axisTitle().fill().hex(),
		axisBackground: theme.plotArea().fill().hex(),
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
