/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import { Container, PivotScatterplot } from '@showwhy/components'
import type {
	Maybe,
	Specification,
	SpecificationCurveConfig,
} from '@showwhy/types'
import { memo } from 'react'

// eslint-disable-next-line
import template from '~data/effect-scatterplot.json'

const templateString = JSON.stringify(template)
export const ResultsGraph: React.FC<{
	specificationData: Specification[]
	specificationCurveConfig: SpecificationCurveConfig
	vegaWindowDimensions: Dimensions
	onMouseOver: (item: Maybe<Specification>) => void
	hovered: Maybe<number>
	failedRefutationIds: string[]
	outcome?: string
}> = memo(function ResultsGraph({
	specificationData,
	specificationCurveConfig,
	vegaWindowDimensions,
	onMouseOver,
	hovered,
	failedRefutationIds,
	outcome,
}) {
	return (
		<Container>
			<PivotScatterplot
				templateString={templateString}
				data={specificationData}
				config={specificationCurveConfig}
				width={vegaWindowDimensions.width}
				height={vegaWindowDimensions.height * 0.25}
				onMouseOver={onMouseOver}
				hovered={hovered}
				outcome={outcome}
				failedRefutationIds={failedRefutationIds}
			/>
		</Container>
	)
})
