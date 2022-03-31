/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '@showwhy/types'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { TabbedScatterplot } from '~components/TabbedScatterplot'
import type {
	DecisionFeature,
	Specification,
	SpecificationCurveConfig,
} from '~types'
import { addOrRemoveArrayElement } from '~utils'

import { AnalyticDecisionsDotPlot } from './AnalyticDecisionsDotPlot'

export const MIN_SPEC_ADDITIONAL_PADDING = 5

export const VegaSpecificationCurve: React.FC<{
	data: Specification[]
	config: SpecificationCurveConfig
	width: number
	height: number
	onConfigChange: any
	onSpecificationSelect: (datum: Maybe<Specification>) => void
	onMouseOver: (item: Maybe<Specification | DecisionFeature>) => void
	hovered: Maybe<number>
	failedRefutationIds: number[]
	outcome?: string
	totalSpecs?: number
}> = memo(function VegaSpecificationCurve({
	data,
	config,
	width,
	height,
	onConfigChange,
	onSpecificationSelect,
	onMouseOver,
	hovered,
	failedRefutationIds,
	outcome,
	totalSpecs,
}) {
	// TODO: these two charts should be combinable into a single vega spec
	// this will also greatly simplify the hover coordination
	const [selected, setSelected] = useState<Maybe<number>>()
	const handleDatumClick = useCallback(
		(item: Maybe<Specification | DecisionFeature>) => {
			if (item && item.id === selected) {
				setSelected(undefined)
				onSpecificationSelect(undefined)
			} else {
				setSelected(item?.id)
				onSpecificationSelect(data.find(d => d.id === item?.id))
			}
		},
		[data, selected, setSelected, onSpecificationSelect],
	)

	const handleAxisClick = useCallback(
		(datum, axis) => {
			if (axis === 'y' && datum) {
				const { inactiveFeatures = [], inactiveSpecifications = [] } = config
				// HACK: do in vega
				const [column, value] = datum.value.split(':')
				const inactiveObjects = data.filter((d: any) => d[column] === value)
				const inactiveIds = inactiveObjects.map(x => x.id)
				const missing = inactiveFeatures.indexOf(value) < 0

				const inactiveList = missing
					? [...inactiveSpecifications, ...inactiveIds]
					: inactiveSpecifications?.filter(s => !inactiveIds.includes(s))

				onConfigChange({
					...config,
					inactiveSpecifications: inactiveList,
					inactiveFeatures: addOrRemoveArrayElement(
						inactiveFeatures,
						value,
						missing,
					),
				})
			}
		},
		[config, onConfigChange, data],
	)
	return (
		<Container data-pw="specification-curve">
			<TabbedScatterplot
				data={data}
				config={config}
				width={width}
				outcome={outcome}
				height={height * 0.25}
				onMouseOver={onMouseOver}
				onMouseClick={handleDatumClick}
				hovered={hovered}
				selected={selected}
				failedRefutationIds={failedRefutationIds}
				totalSpecs={totalSpecs}
				showStats
			/>

			<AnalyticDecisionsDotPlot
				data={data}
				config={config}
				width={width}
				onMouseOver={onMouseOver}
				onMouseClick={handleDatumClick}
				onAxisClick={handleAxisClick}
				height={height * 0.75}
				hovered={hovered}
				selected={selected}
				totalSpecs={totalSpecs}
			/>
		</Container>
	)
})

const Container = styled.div``
