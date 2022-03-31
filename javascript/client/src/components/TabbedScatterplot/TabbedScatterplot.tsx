/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Pivot, PivotItem } from '@fluentui/react'
import type { Handler1, Maybe } from '@showwhy/types'
import { useThematic } from '@thematic/react'
import type { FC } from 'react'
import { memo } from 'react'
import { EffectScatterplot } from 'src/pages/PerformAnalysis/ExploreSpecificationCurvePage/vega'

import type {
	DecisionFeature,
	Specification,
	SpecificationCurveConfig,
} from '~types'

export const TabbedScatterplot: FC<{
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
	showStats?: boolean
}> = memo(function TabbedScatterplot({
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
	showStats,
}) {
	const theme = useThematic()
	return (
		<Pivot
			styles={{
				itemContainer: {
					backgroundColor: theme.application().faint().hex(),
					paddingTop: 10,
				},
			}}
			aria-label="Basic Pivot Example"
		>
			<PivotItem headerText="Outcome">
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
					chartTitle={`Estimated change in ${outcome} by specification`}
					dataValueName="estimatedEffect"
					totalSpecs={totalSpecs}
					showStats={showStats}
				/>
			</PivotItem>
			<PivotItem headerText="Population">
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
					chartTitle={'Population size by specification'}
					dataValueName="populationSize"
					totalSpecs={totalSpecs}
					showStats={showStats}
				/>
			</PivotItem>
		</Pivot>
	)
})
