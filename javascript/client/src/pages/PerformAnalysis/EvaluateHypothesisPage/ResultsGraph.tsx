/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import { Container } from '@showwhy/components'
import type {
	DecisionFeature,
	Maybe,
	Specification,
	SpecificationCurveConfig,
} from '@showwhy/types'
import { memo } from 'react'

import { PivotScatterplot } from '~components/PivotScatterplot'

export const ResultsGraph: React.FC<{
	specificationData: Specification[]
	specificationCurveConfig: SpecificationCurveConfig
	vegaWindowDimensions: Dimensions
	onMouseOver: (item: Maybe<Specification | DecisionFeature>) => void
	hovered: Maybe<number>
	failedRefutationIds: number[]
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
