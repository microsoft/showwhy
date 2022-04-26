/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Pivot, PivotItem } from '@fluentui/react'
import { EffectScatterplot } from '@showwhy/components'
import type {
	Handler1,
	Maybe,
	Specification,
	SpecificationCurveConfig,
} from '@showwhy/types'
import { useThematic } from '@thematic/react'
import type { FC } from 'react'
import { memo, useMemo } from 'react'

interface PivotItemChart {
	pivotName: string
	chartTitle: string
	dataValueName: string
	showStats?: boolean
}

export const PivotScatterplot: FC<{
	templateString: string
	data: Specification[]
	config: SpecificationCurveConfig
	width: number
	height: number
	hovered: Maybe<number>
	failedRefutationIds: string[]
	onMouseOver?: Handler1<Maybe<Specification>>
	onMouseClick?: Handler1<Maybe<Specification>>
	selected?: number
	outcome?: string
	totalSpecs?: number
}> = memo(function PivotScatterplot({
	templateString,
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
				pivotName: 'Effect size',
				chartTitle: `Estimated change in ${outcome} by specification`,
				dataValueName: 'estimatedEffect',
				showStats: true,
			},
			{
				pivotName: 'Population size',
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
							templateString={templateString}
							data={data.map((x, i) => ({ ...x, index: i + 1 }))}
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
