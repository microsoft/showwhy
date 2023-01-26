/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectionState } from '@thematic/core'
import { useThematic } from '@thematic/react'
import { max, min } from 'lodash'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import template from '../data/dot-plot-schema.json'
import { useSpecificationSHAPColumns } from '../hooks/analyticDecisionsDotPlot/useColumns.js'
import { usePrimarySpecificationConfig } from '../state/primarySpecificationConfig.js'
import { CausalityLevel } from '../types/causality/CausalityLevel.js'
import type { Specification } from '../types/visualization/Specification.js'
import type { SpecificationCurveConfig } from '../types/visualization/SpecificationCurveConfig.js'
import { MIN_SPEC_ADDITIONAL_PADDING } from './VegaHost.constants.js'
import { VegaHost } from './VegaHost.js'
import { parseJsonPathSpecMerged } from './VegaHost.util.js'

/* eslint-disable */
const templateString = JSON.stringify(template)

export const AnalyticDecisionsDotPlot: React.FC<{
	data: Specification[]
	config: SpecificationCurveConfig
	width: number
	// TODO: override height based on number of unique decision rows x desired row height
	height: number
	onMouseClick?: (datum?: Specification) => void
	onMouseOver?: (datum?: Specification) => void
	onAxisClick?: (axis: string, datum: any) => void
	hovered?: string
	selected?: string
	totalSpecs?: number
}> = memo(function AnalyticDecisionsDotPlot({
	data,
	config,
	width,
	height,
	onMouseOver,
	onMouseClick,
	onAxisClick,
	hovered,
	selected,
	totalSpecs = data.length,
}) {
	const theme = useThematic()
	const primarySpecificationConfig = usePrimarySpecificationConfig()
	const shapColor = theme
		.rule({ selectionState: SelectionState.Hovered })
		.stroke()
		.hex()

	const shap = useTransformShap(data)

	const padding = useMemo((): any => {
		return totalSpecs > MIN_SPEC_ADDITIONAL_PADDING ? 10 : width * 0.25
	}, [totalSpecs, width])

	const spec = useMemo(() => {
		const shapValues = shap.map((s) => s.value)
		const greater = max(shapValues) || 0.1
		const lowest = min(shapValues) || 0.1
		const maxDomainValue = Math.max(Math.abs(lowest), Math.abs(greater))
		const shapDomain = [-maxDomainValue, 0, maxDomainValue]

		const rawSpec = JSON.parse(templateString)
		const primarySpecificationId = data.find(
			(d) =>
				d.populationType === CausalityLevel.Primary &&
				d.treatmentType === CausalityLevel.Primary &&
				d.outcomeType === CausalityLevel.Primary &&
				d.causalModel
					.toLowerCase()
					.includes(primarySpecificationConfig.causalModel.toLowerCase()) &&
				d.estimator.toLowerCase() ===
					primarySpecificationConfig.type?.toLowerCase(),
		)?.id

		const pathspec = {
			"$.data[?(@.name == 'specifications')].values": data,
			"$.marks[?(@.name == 'inactiveMarks')].encode.update.fill.value": theme
				.rect({ selectionState: SelectionState.NoData })
				.fill()
				.hex(),
			"$.marks[?(@.name == 'shapMarks')].encode.update.fill.value": shapColor,
			"$.marks[?(@.name == 'shapArrows')].encode.update.fill.value": shapColor,
			"$.signals[?(@.name == 'primaryColors')].value": theme
				.scales()
				.nominalBold(10)
				.toArray(),
			"$.scales[?(@.name == 'x')].padding": padding,
			"$.signals[?(@.name == 'shapDomain')].value": shapDomain,
			"$.signals[?(@.name == 'primaryEstimatorId')].value":
				primarySpecificationId,
		}

		return parseJsonPathSpecMerged(rawSpec, pathspec)
	}, [theme, data, primarySpecificationConfig, shap, shapColor, padding])

	const signals = useMemo(
		() => ({
			hoveredId: hovered,
			selectedId: selected,
			showShap: config.shapTicks,
			inactiveFeatures: config.inactiveFeatures,
			inactiveSpecifications: config.inactiveSpecifications,
		}),
		[hovered, selected, config],
	)

	const datasets = useMemo(
		() => ({
			shap,
		}),
		[shap],
	)

	return (
		<Container>
			<VegaHost
				spec={spec}
				width={width}
				height={height}
				onDatumMouseOver={onMouseOver}
				onDatumClick={onMouseClick}
				onAxisClick={onAxisClick}
				signals={signals}
				data={datasets}
			/>
		</Container>
	)
})

const Container = styled.div``

function useTransformShap(data: Specification[]) {
	const shapColumns = useSpecificationSHAPColumns()
	// TODO: fold this in vega
	return useMemo(() => {
		const output: {
			id: string
			key: string
			value: number
		}[] = []
		shapColumns.forEach((column) => {
			const nonSHAP = column.replace('SHAP', '')
			data.forEach((row) => {
				const key = (row as any)[nonSHAP]
				const value = (row as any)[column]
				output.push({
					id: row.id,
					key,
					value,
				})
			})
		})
		return output
	}, [data, shapColumns])
}
