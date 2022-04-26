/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import { Pivot, PivotItem } from '@fluentui/react'
import type {
	Definition,
	Maybe,
	Specification,
	SpecificationCurveConfig,
} from '@showwhy/types'
import type { FC } from 'react'
import { memo, useCallback } from 'react'

import { VegaSpecificationCurve } from './vega/VegaSpecificationCurve'

export const SpecificationGraphs: FC<{
	data: Specification[]
	config: SpecificationCurveConfig
	vegaWindowDimensions: Dimensions
	onSpecificationsChange: (config: SpecificationCurveConfig) => void
	setSelectedSpecification: (item: Maybe<Specification>) => void
	onMouseOver: (item: Maybe<Specification>) => void
	hovered: Maybe<number>
	failedRefutationIds: string[]
	specCount: Maybe<number>
	outcomes: Definition[]
}> = memo(function SpecificationGraphs({
	data,
	config,
	vegaWindowDimensions,
	onSpecificationsChange,
	setSelectedSpecification,
	onMouseOver,
	hovered,
	failedRefutationIds,
	specCount,
	outcomes,
}) {
	const returnVega = useCallback(
		(outcome: string) => (
			<VegaSpecificationCurve
				data={returnOutcomeSpecifications(outcome, data)}
				config={config}
				width={vegaWindowDimensions.width}
				height={vegaWindowDimensions.height}
				onConfigChange={onSpecificationsChange}
				onSpecificationSelect={setSelectedSpecification}
				onMouseOver={onMouseOver}
				hovered={hovered}
				outcome={outcome}
				failedRefutationIds={failedRefutationIds}
				totalSpecs={specCount}
			/>
		),
		[
			data,
			config,
			vegaWindowDimensions,
			onSpecificationsChange,
			setSelectedSpecification,
			onMouseOver,
			hovered,
			failedRefutationIds,
			specCount,
		],
	)

	return (
		<>
			{outcomes.length > 1 ? (
				<Pivot onLinkClick={() => setSelectedSpecification(undefined)}>
					{outcomes?.map(x => {
						return (
							<PivotItem key={x.id} headerText={x.variable}>
								{returnVega(x.variable)}
							</PivotItem>
						)
					})}
				</Pivot>
			) : (
				returnVega(outcomes[0]?.variable || '<outcome>')
			)}
		</>
	)
})

function returnOutcomeSpecifications(outcome: string, data: Specification[]) {
	return data
		.filter(s => s.outcome === outcome)
		.map((x, i) => ({ ...x, index: i + 1 }))
}
