/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LinkCallout, Paragraph, Value } from '@showwhy/components'
import type { Maybe, Question, SignificanceTest } from '@showwhy/types'
import { NodeResponseStatus, Significance } from '@showwhy/types'
import { memo } from 'react'

import { median as calcMedian } from '~utils'

import {
	confidenceIntervalCalloutLine1,
	confidenceIntervalCalloutLine2,
} from '../../../locales/en-US/perform-analysis'

export const SignificanceTestResult: React.FC<{
	significanceTestResult: Maybe<SignificanceTest>
	question: Question
	activeEstimatedEffects: number[]
}> = memo(function SignificanceTestResult({
	significanceTestResult,
	question,
	activeEstimatedEffects,
}) {
	const median = parseFloat(calcMedian(activeEstimatedEffects).toFixed(3))
	const exposure = question?.exposure?.label || '<exposure>'
	const outcome = question?.outcome?.label || '<outcome>'

	return (
		<>
			{significanceTestResult?.status?.toLowerCase() ===
				NodeResponseStatus.Completed && (
				<Paragraph noMarginTop color="accent">
					Taking all valid specifications of the causal analysis into account,
					the answer is
					<Value>
						<LinkCallout
							title={`${
								significanceTestResult?.test_results?.significance ===
								Significance.NotSignificant
									? 'NO'
									: 'YES'
							}.`}
							detailsTitle="Statistical Significance Test"
							noUnderline
						>
							<Paragraph>{confidenceIntervalCalloutLine1}</Paragraph>
							<Paragraph>{confidenceIntervalCalloutLine2}</Paragraph>
						</LinkCallout>
					</Value>
					The median effect size of the resulting estimates is {median}, meaning
					that exposure to {exposure} causes {outcome} to
					{median > 0 ? ' increase ' : ' decrease '}
					by {Math.abs(median)}. The likelihood of observing a median effect at
					least this strong in the absence of an actual causal relationship is
					{' <'}
					{+(significanceTestResult?.test_results?.p_value?.substring(2) || 0) *
						100}
					% ({significanceTestResult?.test_results?.p_value}).
				</Paragraph>
			)}
		</>
	)
})
