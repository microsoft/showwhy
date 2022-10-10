/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as d3 from 'd3'
import { memo, useEffect, useRef } from 'react'

import type { TooltipProps } from './ToolTip.types.js'

const SHOW_DURATION = 100
const HIDE_DURATION = 200
const SHOW_OPACITY = 0.9
const HIDE_OPACITY = 0

export const ToolTip: React.FC<React.PropsWithChildren<TooltipProps>> = memo(
	function Tooltip({
		xPos,
		yPos,
		visible = false,
		onTooltipRemoved,
		children,
	}) {
		const ref = useRef(null)
		useEffect(() => {
			const tooltip = d3.select(ref.current)
			if (visible) {
				tooltip
					.transition()
					.duration(SHOW_DURATION)
					.style('opacity', SHOW_OPACITY)
			} else {
				tooltip
					.transition()
					.duration(HIDE_DURATION)
					.style('opacity', HIDE_OPACITY)
					.on('end', () => onTooltipRemoved())
			}
		}, [visible])

		useEffect(() => {
			const tooltip = d3.select(ref.current)
			const tooltipOffset = 25
			tooltip
				.style('left', (xPos + tooltipOffset).toString() + 'px')
				.style('top', (yPos - tooltipOffset).toString() + 'px')
		}, [xPos, yPos])

		return (
			<div ref={ref} style={{ position: 'fixed' }}>
				{children}
			</div>
		)
	},
)
