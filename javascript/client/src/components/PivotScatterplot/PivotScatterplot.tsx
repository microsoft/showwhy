/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Pivot, PivotItem } from '@fluentui/react'
import type { Handler1, Maybe } from '@showwhy/types'
import { useThematic } from '@thematic/react'
import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { EffectScatterplot } from 'src/pages/PerformAnalysis/EstimateCausalEffectsPage/vega'

import type {
	DecisionFeature,
	Specification,
	SpecificationCurveConfig,
} from '~types'

interface PivotItemChart {
	pivotName: string
	chartTitle: string
	dataValueName: string
	showStats?: boolean
}

export const PivotScatterplot: FC<{
	data: Specification[]
	config: SpecificationCurveConfig
	width: number
	height: number
	hovered: Maybe<number>
	failedRefutationIds: number[]
	onMouseOver?: Handler1<Maybe<Specification | DecisionFeature>>
	onMouseClick?: Handler1<Maybe<Specification>>
	selected?: number
	outcome?: string
	totalSpecs?: number
}> = memo(function PivotScatterplot({
	data,
	config,
	width,
	height,
	onMouseOver,
	hovered,
	failedRefutationIds,
	selected,
	outcome,
	totalSpecs,
	onMouseClick,
}) {
	const theme = useThematic()

	const pivotItems = useMemo((): PivotItemChart[] => {
		return [
			{
				pivotName: 'Outcome',
				chartTitle: `Estimated change in ${outcome} by specification`,
				dataValueName: 'estimatedEffect',
				showStats: true,
			},
			{
				pivotName: 'Population',
				chartTitle: 'Population size by specification',
				dataValueName: 'populationSize',
			},
		] as PivotItemChart[]
	}, [outcome])

	return (
		<Pivot
			styles={{
				itemContainer: {
					backgroundColor: theme.application().faint().hex(),
					paddingTop: 10,
				},
			}}
			aria-label="Graphs Pivotted Items"
		>
			{pivotItems.map((p: PivotItemChart) => {
				return (
					<PivotItem key={p.pivotName} headerText={p.pivotName}>
						<EffectScatterplot
							data={data}
							config={config}
							width={width}
							height={height}
							onMouseOver={onMouseOver}
							onMouseClick={onMouseClick}
							hovered={hovered}
							selected={selected}
							failedRefutationIds={failedRefutationIds}
							chartTitle={p.chartTitle}
							dataValueName={p.dataValueName}
							totalSpecs={totalSpecs}
							showStats={p.showStats}
						/>
					</PivotItem>
				)
			})}
		</Pivot>
	)
})
