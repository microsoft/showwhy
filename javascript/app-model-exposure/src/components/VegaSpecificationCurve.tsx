/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

/* eslint-disable */
import template from '../data/effect-scatterplot.json'
import type { Maybe } from '../types/primitives.js'
import type { Specification } from '../types/visualization/Specification.js'
import type { SpecificationCurveConfig } from '../types/visualization/SpecificationCurveConfig.js'
import { addOrRemoveArrayElement } from '../utils/arrays.js'
import { AnalyticDecisionsDotPlot } from './AnalyticDecisionsDotPlot'
import { PivotScatterplot } from './PivotScatterplot.js'

const templateString = JSON.stringify(template)

export const VegaSpecificationCurve: React.FC<{
	data: Specification[]
	config: SpecificationCurveConfig
	width: number
	height: number
	onConfigChange: any
	onSpecificationSelect: (datum: Maybe<Specification>) => void
	onMouseOver: (item: Maybe<Specification>) => void
	hovered: Maybe<string>
	failedRefutationTaskIds: string[]
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
	failedRefutationTaskIds,
	outcome,
	totalSpecs,
}) {
	// TODO: these two charts should be combinable into a single vega spec
	// this will also greatly simplify the hover coordination
	const [selected, setSelected] = useState<Maybe<string>>()
	const [latestList, setLatestList] = useState<Specification[]>(data)

	const onChangeSelectedItem = useCallback(
		(id?: string) => {
			setSelected(id)
			onSpecificationSelect(data.find(d => d.id === id))
		},
		[data, setSelected, onSpecificationSelect],
	)

	const handleDatumClick = useCallback(
		(item: Maybe<Specification>) => {
			if (item && item.id === selected) {
				onChangeSelectedItem(undefined)
			} else {
				onChangeSelectedItem(item?.id)
			}
		},
		[selected, onSpecificationSelect],
	)

	const updateIds = useCallback(
		(newList: Specification[]) => {
			const totalEstimatesReturned = latestList.length
			if (selected && totalSpecs !== totalEstimatesReturned) {
				const item = latestList.find(x => x.id === selected)
				const newItem = newList.find(x => x.taskId === item?.taskId)
				if (newItem?.id !== item?.id) {
					onChangeSelectedItem(newItem?.id)
				}
			}
			setLatestList(newList)
		},
		[latestList, selected, setLatestList, onChangeSelectedItem, totalSpecs],
	)

	useEffect(() => {
		updateIds(data)
	}, [data, updateIds])

	const handleAxisClick = useCallback(
		(datum: any, axis: string) => {
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
			<PivotScatterplot
				templateString={templateString}
				data={data}
				config={config}
				width={width}
				outcome={outcome || '<outcome>'}
				height={height * 0.25}
				onMouseOver={onMouseOver}
				onMouseClick={handleDatumClick}
				hovered={hovered}
				selected={selected}
				failedRefutationTaskIds={failedRefutationTaskIds}
				totalSpecs={totalSpecs}
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
