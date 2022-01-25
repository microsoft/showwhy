/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dimensions } from '@essex-js-toolkit/hooks'
import { memo } from 'react'
import { OutcomeEffectScatterplot } from '../ExploreSpecificationCurvePage/vega'
import { RefutationType } from '~enums'
import {
	DecisionFeature,
	DescribeElements,
	Specification,
	SpecificationCurveConfig,
} from '~interfaces'
import { Paragraph, Value, Container, Bold, Text } from '~styles'
import { calculateMedian } from '~utils'

interface ResultsGraphProps {
	specificationData: Specification[]
	activeValues: number[]
	defineQuestion: DescribeElements
	specificationCurveConfig: SpecificationCurveConfig
	vegaWindowDimensions: Dimensions
	onMouseOver: (item: Specification | DecisionFeature | undefined) => void
	hovered: number | undefined
	failedRefutationIds: number[]
	refutationType: RefutationType
}

export const ResultsGraph: React.FC<ResultsGraphProps> = memo(
	function ResultsGraph({
		specificationData,
		activeValues,
		defineQuestion,
		specificationCurveConfig,
		vegaWindowDimensions,
		onMouseOver,
		hovered,
		failedRefutationIds,
		refutationType,
	}) {
		const median = parseFloat(calculateMedian(activeValues).toFixed(3))
		const exposure = defineQuestion?.exposure?.label || '<exposure>'
		const outcome = defineQuestion?.outcome?.label || '<outcome>'
		const hypothesis = defineQuestion?.hypothesis || '<hypothesis>'

		return (
			<Container>
				<Paragraph>
					<Value>{activeValues.length}</Value>
					of {specificationData.length} specifications were included in the
					final curve. The median effect estimated from these specifications is{' '}
					<Value>{median}.</Value> This means that the exposure to {exposure}{' '}
					causes the {outcome} to {hypothesis} by
					<Value>{median}.</Value>
					This was calculated using
					<Value>{defineQuestion?.population?.definition?.length}</Value>
					population and
					<Value>{defineQuestion?.exposure?.definition?.length}</Value>
					exposure definitions.
					{refutationType === RefutationType.QuickRefutation && (
						<Text>
							{' '}
							Consider running the analysis with the
							<Bold> Full Refutation</Bold> mode before proceeding to the
							significance test.
						</Text>
					)}
				</Paragraph>
				<OutcomeEffectScatterplot
					data={specificationData}
					config={specificationCurveConfig}
					width={vegaWindowDimensions.width * 0.9}
					height={vegaWindowDimensions.height * 0.25}
					onMouseOver={onMouseOver}
					hovered={hovered}
					title="Specification"
					failedRefutationIds={failedRefutationIds}
				/>
			</Container>
		)
	},
)
