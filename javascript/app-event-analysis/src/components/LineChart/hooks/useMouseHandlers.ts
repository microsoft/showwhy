/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { select } from 'd3'
import { useCallback, useMemo } from 'react'

import { useTooltip } from '../../../hooks/useTooltip.js'
import { useTreatedUnitsMap } from '../../../hooks/useTreatedUnitsMap.js'
import type { LineData, TooltipInfo } from '../../../types'
import {
	HIGHLIGHT_LINE,
	LINE_ELEMENT_CLASS_NAME,
	LINE_WIDTH,
	LINE_WIDTH_HOVER,
	LINE_WIDTH_TREATED,
	OUTPUT_LINE,
	OUTPUT_LINE_WIDTH,
	SYNTHETIC_UNIT,
	TRANSPARENT_LINE,
} from '../../../types'
import { getHoverIdFromValue } from '../../../utils/charts.js'
import { isValidUnit } from '../../../utils/validation.js'
import type {
	HandleLineMouseClickOrMoveProps,
	MouseHandlers,
	MouseHandlersProps,
} from '../LineChart.types.js'
import { constructLineTooltipContent } from '../LineChart.utils.js'

export function useMouseHandlers(props: MouseHandlersProps): MouseHandlers {
	const tooltip = useTooltip()
	const { hide: hideTooltip } = tooltip

	const fullProps = useMemo<HandleLineMouseClickOrMoveProps>(
		() => ({ ...props, tooltip }),
		[tooltip, props],
	)

	const handleContainerClick = useHandleContainerClick(fullProps)
	const handleLineMouseClick = useHandleLineMouseClick(fullProps)
	const handleLineMouseMove = useHandleLineMouseMove(fullProps)
	const handleLineMouseLeave = useHandleLineMouseLeave(fullProps)

	return useMemo(() => {
		return {
			tooltip,
			handleLineMouseMove,
			handleLineMouseClick,
			handleLineMouseLeave,
			handleContainerClick,
			handleClickOutside: () => hideTooltip(true),
		}
	}, [
		tooltip,
		handleLineMouseMove,
		handleLineMouseClick,
		handleLineMouseLeave,
		handleContainerClick,
		hideTooltip,
	])
}

function useHandleContainerClick(props: HandleLineMouseClickOrMoveProps) {
	const { setHoverUnit, tooltip } = props
	const { hide: hideTooltip } = tooltip
	return useCallback(
		(event: React.MouseEvent) => {
			const element = event.target as Element

			if (!element.classList.contains(LINE_ELEMENT_CLASS_NAME)) {
				hideTooltip(true)
				setHoverUnit('')
			}
		},
		[hideTooltip, setHoverUnit],
	)
}

function useHandleLineMouseLeave(props: HandleLineMouseClickOrMoveProps) {
	const {
		tooltip,
		hoverInfo,
		treatedUnits,
		renderRawData,
		isPlaceboSimulation,
		showMeanTreatmentEffect,
	} = props
	const { hide: hideTooltip } = tooltip
	const getLineHoverAttributes = useGetLineHoverAttributes(
		treatedUnits,
		renderRawData,
		isPlaceboSimulation,
	)
	return useCallback(
		(event: React.MouseEvent) => {
			const path = select<SVGElement, LineData[]>(event.target as SVGElement)
			const dt = path.datum()

			hideTooltip()

			if (!showMeanTreatmentEffect) {
				const { width, opacity } = getLineHoverAttributes(dt)
				console.log({ width, opacity })
				path.attr('stroke-width', width).attr('opacity', opacity)

				// if non-placebo outline lines are shown, then reset their attributes
				if (!renderRawData && !isPlaceboSimulation) {
					// leaving hover over a non-placebo output line (either treated or synth-control line)
					const chart = select('.line-chart')
					treatedUnits.forEach((treatedUnit: string) => {
						// treated line
						const targetLine = chart.selectAll<SVGPathElement, LineData[]>(
							'.' + getHoverIdFromValue(treatedUnit),
						)
						targetLine
							.attr('stroke-width', OUTPUT_LINE_WIDTH)
							.attr('opacity', HIGHLIGHT_LINE)

						// synthetic control line that corresponds to treated line
						const unit = SYNTHETIC_UNIT + ' ' + treatedUnit
						const targetLine2 = chart.selectAll<SVGPathElement, LineData[]>(
							'.' + getHoverIdFromValue(unit),
						)
						targetLine2
							.attr('stroke-width', OUTPUT_LINE_WIDTH)
							.attr('opacity', HIGHLIGHT_LINE)
					})
				}

				hoverInfo.setHoverItem({
					data: dt,
					xPos: 0,
					yPos: 0,
					isPreviousHover: true,
				} as TooltipInfo)
			}
		},
		[
			hideTooltip,
			isPlaceboSimulation,
			renderRawData,
			hoverInfo,
			treatedUnits,
			getLineHoverAttributes,
			showMeanTreatmentEffect,
		],
	)
}

function useHandleLineMouseClickOrMove(props: HandleLineMouseClickOrMoveProps) {
	const {
		xScale,
		tooltip,
		hoverInfo,
		leftMargin,
		treatedUnits,
		renderRawData,
		checkableUnits,
		isPlaceboSimulation,
		showMeanTreatmentEffect,
	} = props
	const { show: showTooltip, stick: persistTooltip } = tooltip
	return useCallback(
		(event: React.MouseEvent, fromClick = false) => {
			const path = select<SVGElement, LineData[]>(event.target as SVGElement)
			const data = path.datum()

			const xPos = event.clientX
			const yPos = event.clientY
			const relXPos = event.nativeEvent.offsetX - leftMargin
			const date = xScale.invert(relXPos)

			const toolTipContent: { content: JSX.Element; unit: string } =
				constructLineTooltipContent(data, date)
			showTooltip({
				contentEl: toolTipContent.content,
				xPos,
				yPos,
				options: {
					unit: toolTipContent.unit,
					force: fromClick,
				},
			})
			if (fromClick && checkableUnits.includes(toolTipContent.unit)) {
				persistTooltip()
			}

			if (!showMeanTreatmentEffect) {
				if (!renderRawData && !isPlaceboSimulation && data.length > 0) {
					//
					// hovering over an output line (either treated or synth-control line)
					//
					// de-emphasize all output lines
					//  except those that belong to the current treated unit
					const chart = select('.line-chart')
					const currentUnit = data[0].unit
					const unit = currentUnit.startsWith(SYNTHETIC_UNIT)
						? currentUnit.substring(SYNTHETIC_UNIT.length + 1)
						: currentUnit
					treatedUnits.forEach((treatedUnit: string) => {
						if (unit !== treatedUnit) {
							const targetLine = chart.selectAll<SVGPathElement, LineData[]>(
								'.' + getHoverIdFromValue(treatedUnit),
							)
							targetLine
								.attr('stroke-width', LINE_WIDTH)
								.attr('opacity', OUTPUT_LINE)
							// synthetic control line that corresponds to treated line
							const sunit = SYNTHETIC_UNIT + ' ' + treatedUnit
							const targetLine2 = chart.selectAll<SVGPathElement, LineData[]>(
								'.' + getHoverIdFromValue(sunit),
							)
							targetLine2
								.attr('stroke-width', LINE_WIDTH)
								.attr('opacity', OUTPUT_LINE)
						}
					})
				} else {
					// hover over input data lines or output lines from placebo results
					path
						.attr('stroke-width', LINE_WIDTH_HOVER)
						.attr('opacity', HIGHLIGHT_LINE)
				}

				hoverInfo.setHoverItem({
					data: data,
					xPos: xPos,
					yPos: yPos,
					date: date,
				} as TooltipInfo)
			}
		},
		[
			leftMargin,
			showTooltip,
			xScale,
			treatedUnits,
			hoverInfo,
			isPlaceboSimulation,
			renderRawData,
			showMeanTreatmentEffect,
			checkableUnits,
			persistTooltip,
		],
	)
}

function useHandleLineMouseMove(props: HandleLineMouseClickOrMoveProps) {
	const handleLineMouseClickOrMove = useHandleLineMouseClickOrMove(props)

	return useCallback(
		(event: React.MouseEvent) => {
			handleLineMouseClickOrMove(event)
		},
		[handleLineMouseClickOrMove],
	)
}

function useHandleLineMouseClick(props: HandleLineMouseClickOrMoveProps) {
	const {
		setHoverUnit,
		renderRawData,
		isPlaceboSimulation,
		showMeanTreatmentEffect,
	} = props
	const handleLineMouseClickOrMove = useHandleLineMouseClickOrMove(props)
	return useCallback(
		(event: React.MouseEvent) => {
			handleLineMouseClickOrMove(event, true)

			if (!renderRawData && !isPlaceboSimulation && !showMeanTreatmentEffect) {
				event.stopPropagation()
				const path = select<SVGElement, LineData[]>(event.target as SVGElement)
				const data = path.datum()
				const currentUnit = data[0].unit
				setHoverUnit(currentUnit)
			}
		},
		[
			setHoverUnit,
			handleLineMouseClickOrMove,
			isPlaceboSimulation,
			renderRawData,
			showMeanTreatmentEffect,
		],
	)
}

function useGetLineHoverAttributes(
	treatedUnits: string[],
	renderRawData: boolean,
	isPlaceboSimulation: boolean,
) {
	const treatedUnitsMap = useTreatedUnitsMap(treatedUnits)

	return useCallback(
		(dt: LineData[]) => {
			let width = LINE_WIDTH
			let opacity = TRANSPARENT_LINE
			if (treatedUnits.every(isValidUnit)) {
				if (renderRawData) {
					if (treatedUnitsMap[dt[dt.length - 1].unit]) {
						// check last time stamp
						width = LINE_WIDTH_TREATED
						opacity = HIGHLIGHT_LINE
					}
				} else {
					// showing output lines: either with placebo output or not
					if (isPlaceboSimulation) {
						if (treatedUnitsMap[dt[dt.length - 1].unit]) {
							// check last time stamp
							width = LINE_WIDTH_TREATED
							opacity = HIGHLIGHT_LINE
						}
					} else {
						// showing the synthetic control and treated lines
						opacity = HIGHLIGHT_LINE
						width = OUTPUT_LINE_WIDTH
					}
				}
			}
			return {
				width,
				opacity,
			}
		},
		[renderRawData, treatedUnits, isPlaceboSimulation, treatedUnitsMap],
	)
}
