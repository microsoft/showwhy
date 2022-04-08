/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isProcessingStatus } from '@showwhy/api-client'
import type {
	Experiment,
	Handler,
	Maybe,
	SignificanceTest,
} from '@showwhy/types'
import { NodeResponseStatus, Significance } from '@showwhy/types'
import { memo } from 'react'

import { LinkCallout } from '~components/Callout'
import { ProgressBar } from '~components/ProgressBar'
import { Paragraph, Value } from '~styles'
import { median as calcMedian } from '~utils'

import {
	confidenceIntervalCalloutLine1,
	confidenceIntervalCalloutLine2,
} from '../../../locales/en-US/perform-analysis'

export const SignificanceTests: React.FC<{
	significanceTestResult: Maybe<SignificanceTest>
	cancelRun: Handler
	isCanceled: boolean
	defineQuestion: Experiment
	activeValues: number[]
}> = memo(function SignificanceTests({
	significanceTestResult,
	cancelRun,
	isCanceled,
	defineQuestion,
	activeValues,
}) {
	const median = parseFloat(calcMedian(activeValues).toFixed(3))
	const exposure = defineQuestion?.exposure?.label || '<exposure>'
	const outcome = defineQuestion?.outcome?.label || '<outcome>'

	return (
		<>
			{significanceTestResult?.status?.toLowerCase() ===
				NodeResponseStatus.Completed && (
				<Paragraph color="accent">
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
						>
							<Paragraph>{confidenceIntervalCalloutLine1}</Paragraph>
							<Paragraph>{confidenceIntervalCalloutLine2}</Paragraph>
						</LinkCallout>
					</Value>
					The median effect size of the resulting estimates is {median}, meaning
					that exposure to {exposure}
					causes {outcome} {median > 0 ? ' increase ' : ' decrease '}
					by {Math.abs(median)}. The likelihood of observing a median effect at
					least this strong in the absence of an actual causal relationship is
					X% ({significanceTestResult?.test_results?.p_value}).
				</Paragraph>
			)}

			{significanceTestResult &&
				isProcessingStatus(
					significanceTestResult.status as NodeResponseStatus,
				) && (
					<ProgressBar
						description={
							isCanceled ? 'This could take a few seconds.' : undefined
						}
						label={`Significance test: Simulations ${significanceTestResult?.simulation_completed}/${significanceTestResult?.total_simulations}`}
						percentage={significanceTestResult?.percentage as number}
						startTime={significanceTestResult?.startTime as Date}
						onCancel={() => (!isCanceled ? cancelRun() : undefined)}
					/>
				)}
		</>
	)
})
