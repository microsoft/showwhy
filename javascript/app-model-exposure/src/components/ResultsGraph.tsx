/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import { memo } from 'react'

// eslint-disable-next-line
import template from '../data/effect-scatterplot.json'
import type { Maybe } from '../types/primitives.js'
import type { Specification } from '../types/visualization/Specification.js'
import type { SpecificationCurveConfig } from '../types/visualization/SpecificationCurveConfig.js'
import { PivotScatterplot } from './PivotScatterplot.js'
import { Container } from './styles.js'

const templateString = JSON.stringify(template)
export const ResultsGraph: React.FC<{
	specificationData: Specification[]
	specificationCurveConfig: SpecificationCurveConfig
	vegaWindowDimensions: Dimensions
	onMouseOver: (item: Maybe<Specification>) => void
	hovered: Maybe<string>
	failedRefutationTaskIds: string[]
	outcome?: string
}> = memo(function ResultsGraph({
	specificationData,
	specificationCurveConfig,
	vegaWindowDimensions,
	onMouseOver,
	hovered,
	failedRefutationTaskIds,
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
				failedRefutationTaskIds={failedRefutationTaskIds}
			/>
		</Container>
	)
})
