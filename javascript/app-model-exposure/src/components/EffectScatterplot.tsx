/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { SelectionState } from '@thematic/core'
import { useThematic } from '@thematic/react'
import upperFirst from 'lodash/upperFirst'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { RefutationResultString } from '../types/refutation/RefutationResultString.js'
import type { Specification } from '../types/visualization/Specification.js'
import type { SpecificationCurveConfig } from '../types/visualization/SpecificationCurveConfig.js'
import { MIN_SPEC_ADDITIONAL_PADDING } from './VegaHost.constants.js'
import { VegaHost } from './VegaHost.js'
import { parseJsonPathSpecMerged } from './VegaHost.util.js'

/* eslint-disable */
export const EffectScatterplot: React.FC<{
	data: Specification[]
	config: SpecificationCurveConfig
	width: number
	height: number
	dataValueName: string
	templateString: string
	onConfigChange?: (config: SpecificationCurveConfig) => void
	onMouseClick?: (datum?: Specification) => void
	onMouseOver?: (datum?: Specification) => void
	hovered?: string
	selected?: string
	title?: string
	chartTitle?: string
	failedRefutationTaskIds: string[]
	totalSpecs?: number
	showStats?: boolean
}> = memo(function EffectScatterplot({
	templateString,
	data,
	config,
	width,
	height,
	onMouseOver,
	onMouseClick,
	hovered,
	selected,
	title,
	failedRefutationTaskIds,
	chartTitle,
	dataValueName,
	totalSpecs = data.length,
	showStats,
}) {
	const spec = useOverlay(
		data,
		width,
		totalSpecs,
		dataValueName,
		templateString,
		title,
		chartTitle,
	)

	const signals = useMemo(
		() => ({
			hoveredId: hovered,
			selectedId: selected,
			showMedian: showStats && config.medianLine,
			showMean: showStats && config.meanLine,
			showConfidenceInterval: config.confidenceIntervalTicks,
			inactiveFeatures: config.inactiveFeatures,
			inactiveSpecifications: config.inactiveSpecifications?.concat(
				failedRefutationTaskIds,
			),
		}),
		[hovered, selected, config, failedRefutationTaskIds, showStats],
	)

	return (
		<Container>
			<VegaHost
				spec={spec}
				width={width}
				height={height}
				onDatumMouseOver={onMouseOver}
				onDatumClick={onMouseClick}
				signals={signals}
			/>
		</Container>
	)
})

function useOverlay(
	data: Specification[],
	width: number,
	totalSpecs: number,
	dataValueName: string,
	templateString: string,
	title?: string,
	chartTitle?: string,
) {
	const theme = useThematic()
	const refutationLegend = Object.keys(RefutationResultString).map(
		(key) => (RefutationResultString as any)[key],
	)

	const padding = useMemo((): any => {
		return totalSpecs > MIN_SPEC_ADDITIONAL_PADDING ? 10 : width * 0.25
	}, [totalSpecs, width])

	return useMemo(() => {
		const colors = theme.scales().nominal(15)
		const median = colors(4).hex()
		const mean = colors(5).hex()
		const effect = theme.process().fill().hex()
		const inactiveColor = theme
			.rect({ selectionState: SelectionState.NoData })
			.fill()
			.hex()
		const green = theme.nearest('green').hex()

		const refutationColors = [effect, inactiveColor, green, green]

		const spec = JSON.parse(templateString)
		const pathspec = {
			"$.data[?(@.name == 'specifications')].values": data,
			"$.scales[?(@.name == 'refutationLegend')].domain": refutationLegend,
			"$.signals[?(@.name == 'chartTitle')].value": upperFirst(
				(chartTitle ?? '').toLowerCase(),
			),
			"$.signals[?(@.name == 'refutationColors')].value": refutationColors,
			"$.signals[?(@.name == 'dataValueName')].value": dataValueName,
			"$.axes[?(@.scale == 'x')].title": title,
			"$.axes[?(@.scale == 'x')].labels": title && title.length > 0,
			"$.scales[?(@.name == 'x')].padding": padding,
			// TODO: thematic needs to support title config
			'$.title.color': theme.axisTitle().fill().hex(),
			"$.marks[?(@.name == 'inactiveEffects')].encode.update.fill.value":
				inactiveColor,
			"$.marks[?(@.name == 'median')].encode.update.stroke.value": median,
			"$.marks[?(@.name == 'mean')].encode.update.stroke.value": mean,
			"$.marks[?(@.name == 'medianLegend')].marks[?(@.name == 'medianLegendLine')].encode.update.stroke.value":
				median,
			"$.marks[?(@.name == 'meanLegend')].marks[?(@.name == 'meanLegendLine')].encode.update.stroke.value":
				mean,
		}
		return parseJsonPathSpecMerged(spec, pathspec)
	}, [
		theme,
		data,
		title,
		chartTitle,
		refutationLegend,
		padding,
		dataValueName,
		templateString,
	])
}

const Container = styled.div`
	margin-top: -15px;
`
