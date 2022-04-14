/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { VegaHost } from '@showwhy/components'
import {
	RefutationResultString,
	Specification,
	SpecificationCurveConfig,
} from '@showwhy/types'
import { SelectionState } from '@thematic/core'
import { useThematic } from '@thematic/react'
import upperFirst from 'lodash/upperFirst'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import template from './scatter-plot.json'
import { mergeSpec, parseJsonPathSpec } from './util'
import { MIN_SPEC_ADDITIONAL_PADDING } from './VegaSpecificationCurve'

const templateString = JSON.stringify(template)

export const EffectScatterplot: React.FC<{
	data: Specification[]
	config: SpecificationCurveConfig
	width: number
	height: number
	dataValueName: string
	onConfigChange?: (config: SpecificationCurveConfig) => void
	onMouseClick?: (datum?: Specification) => void
	onMouseOver?: (datum?: Specification) => void
	hovered?: number
	selected?: number
	title?: string
	chartTitle?: string
	failedRefutationIds: number[]
	totalSpecs?: number
	showStats?: boolean
}> = memo(function EffectScatterplot({
	data,
	config,
	width,
	height,
	onMouseOver,
	onMouseClick,
	hovered,
	selected,
	title,
	failedRefutationIds,
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
			inactiveSpecifications:
				config.inactiveSpecifications?.concat(failedRefutationIds),
		}),
		[hovered, selected, config, failedRefutationIds, showStats],
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
			></VegaHost>
		</Container>
	)
})

function useOverlay(
	data: Specification[],
	width: number,
	totalSpecs: number,
	dataValueName: string,
	title?: string,
	chartTitle?: string,
) {
	const theme = useThematic()
	const refutationLegend = Object.keys(RefutationResultString).map(
		key => (RefutationResultString as any)[key],
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

		const refutationColors = [
			effect,
			inactiveColor,
			colors(1).hex(),
			colors(1).hex(),
		]
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
		const overlay = parseJsonPathSpec(spec, pathspec)
		return mergeSpec(spec, overlay)
	}, [theme, data, title, chartTitle, refutationLegend, padding, dataValueName])
}

const Container = styled.div`
	margin-top: -15px;
`
