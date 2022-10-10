/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { NodeResponseStatus } from '../types/api/NodeResponseStatus.js'
import type { SignificanceTestStatus } from '../types/api/SignificanceTestStatus.js'
import type { Maybe } from '../types/primitives.js'
import type { CausalQuestion } from '../types/question/CausalQuestion.js'
import { median as calcMedian } from '../utils/stats.js'
import { LinkCallout } from './CalloutLink.js'
import {
	confidenceIntervalCalloutLine1,
	confidenceIntervalCalloutLine2,
} from './SignificanceTestResult.constants.js'
import { Paragraph, Value } from './styles.js'

export const SignificanceTestResult: React.FC<{
	significanceTestResult: Maybe<SignificanceTestStatus>
	question: CausalQuestion
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
				NodeResponseStatus.Success && (
				<Paragraph noMarginTop style={{ color: '#3f75bf' }}>
					Taking all valid specifications of the causal analysis into account,
					the answer is
					<Value>
						<LinkCallout
							title={`${
								!significanceTestResult?.results?.significance ? 'NO' : 'YES'
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
					{+(significanceTestResult?.results?.p_value?.substring(2) || 0) * 100}
					% ({significanceTestResult?.results?.p_value}).
				</Paragraph>
			)}
		</>
	)
})
