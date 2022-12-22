/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { TooltipContent } from './ChartTooltip.styles.js'
import type { ChartTooltipProps } from './ChartTooltip.types.js'
import { ToolTip } from './ToolTip.js'

export const ChartTooltip: React.FC<ChartTooltipProps> = memo(
	function ChartTooltip({
		tooltip,
		onRemoveCheckedUnit,
		checkableUnits,
		checkedUnits,
	}) {
		const {
			hide: hideTooltip,
			unStick: unPersistTooltip,
			stickyState: isTooltipPersisted,
		} = tooltip

		const handleTooltipRemoved = useCallback(() => {
			unPersistTooltip()
		}, [unPersistTooltip])

		const handleRemoveLineClick = useCallback(
			(unit: string) => {
				hideTooltip(true)
				onRemoveCheckedUnit(unit)
			},
			[onRemoveCheckedUnit, hideTooltip],
		)

		return (
			<ToolTip
				xPos={tooltip.x}
				yPos={tooltip.y}
				visible={tooltip.visible}
				onTooltipRemoved={handleTooltipRemoved}
			>
				<TooltipContent>
					<div>
						{tooltip.content?.map((p: string, i: number) => (
							<p key={i}>{p}</p>
						))}
					</div>
					{isTooltipPersisted &&
						checkableUnits.includes(tooltip.unit) &&
						checkedUnits &&
						checkedUnits.has(tooltip.unit) && (
							<DefaultButton
								text="Remove"
								onClick={() => handleRemoveLineClick(tooltip.unit)}
							/>
						)}
				</TooltipContent>
			</ToolTip>
		)
	},
)
