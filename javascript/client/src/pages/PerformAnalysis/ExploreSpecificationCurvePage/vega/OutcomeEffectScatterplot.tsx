/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RefutationResultString } from '@showwhy/types'
import { SelectionState } from '@thematic/core'
import { useThematic } from '@thematic/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { VegaHost } from '../VegaHost'
import template from './scatter-plot.json'
import { mergeSpec, parseJsonPathSpec } from './util'
import type { Specification, SpecificationCurveConfig } from '~types'

const templateString = JSON.stringify(template)

export const OutcomeEffectScatterplot: React.FC<{
	data: Specification[]
	config: SpecificationCurveConfig
	width: number
	height: number
	onConfigChange?: (config: SpecificationCurveConfig) => void
	onMouseClick?: (datum?: Specification) => void
	onMouseOver?: (datum?: Specification) => void
	hovered?: number
	selected?: number
	title?: string
	outcome?: string
	failedRefutationIds: number[]
}> = memo(function OutcomeEffectScatterplot({
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
	outcome,
}) {
	const spec = useOverlay(data, title, outcome)

	const signals = useMemo(
		() => ({
			hoveredId: hovered,
			selectedId: selected,
			showMedian: config.medianLine,
			showMean: config.meanLine,
			showConfidenceInterval: config.confidenceIntervalTicks,
			inactiveFeatures: config.inactiveFeatures,
			inactiveSpecifications:
				config.inactiveSpecifications?.concat(failedRefutationIds),
		}),
		[hovered, selected, config, failedRefutationIds],
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

function useOverlay(data: Specification[], title?: string, outcome?: string) {
	const theme = useThematic()
	const refutationLegend = Object.keys(RefutationResultString).map(
		key => (RefutationResultString as any)[key],
	)

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
			"$.signals[?(@.name == 'outcome')].value": (
				outcome ??
				data[0]?.outcome ??
				''
			).toLowerCase(),
			"$.signals[?(@.name == 'refutationColors')].value": refutationColors,
			"$.axes[?(@.scale == 'x')].title": title,
			"$.axes[?(@.scale == 'x')].labels": title && title.length > 0,
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
	}, [theme, data, title, outcome, refutationLegend])
}

const Container = styled.div`
	margin-top: -15px;
`
