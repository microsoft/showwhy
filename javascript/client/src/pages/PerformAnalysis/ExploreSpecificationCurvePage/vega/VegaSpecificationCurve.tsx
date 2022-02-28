/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { AnalyticDecisionsDotPlot } from './AnalyticDecisionsDotPlot'
import { OutcomeEffectScatterplot } from './OutcomeEffectScatterplot'
import type {
	DecisionFeature,
	Specification,
	SpecificationCurveConfig,
} from '~types'
import type { Maybe } from '@showwhy/types'
import { addOrRemoveArrayElement } from '~utils'

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
			<OutcomeEffectScatterplot
				data={data}
				config={config}
				width={width}
				height={height * 0.25}
				onMouseOver={onMouseOver}
				onMouseClick={handleDatumClick}
				hovered={hovered}
				selected={selected}
				failedRefutationIds={failedRefutationIds}
				outcome={outcome}
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
			/>
		</Container>
	)
})

const Container = styled.div``
