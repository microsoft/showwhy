/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import {
	confidenceIntervalCalloutLine1,
	confidenceIntervalCalloutLine2,
} from '../../../locales/en-US/perform-analysis'
import { LinkCallout } from '~components/Callout'
import { ProgressBar } from '~components/ProgressBar'
import { Paragraph, Value } from '~styles'
import {
	Significance,
	NodeResponseStatus,
	SignificanceTest,
	Maybe,
	Handler,
} from '~types'
import { isProcessingStatus } from '~utils'

export const SignificanceTests: React.FC<{
	significanceTestsResult: Maybe<SignificanceTest>
	cancelRun: Handler
	isCanceled: boolean
}> = memo(function SignificanceTests({
	significanceTestsResult,
	cancelRun,
	isCanceled,
}) {
	return (
		<>
			{significanceTestsResult?.status?.toLowerCase() ===
				NodeResponseStatus.Completed && (
				<Paragraph color="accent">
					Results of the significance test show that there is
					<Value>
						<LinkCallout
							title={`${
								significanceTestsResult?.test_results?.significance ===
								Significance.NotSignificant
									? 'no '
									: 'a '
							} statistically significant difference`}
							detailsTitle="Statistical Significance Test"
						>
							<Paragraph>{confidenceIntervalCalloutLine1}</Paragraph>
							<Paragraph>{confidenceIntervalCalloutLine2}</Paragraph>
						</LinkCallout>
					</Value>
					between the observed median effect and that of the null distribution (
					{significanceTestsResult?.test_results?.p_value}).
				</Paragraph>
			)}

			{significanceTestsResult &&
				isProcessingStatus(
					significanceTestsResult.status as NodeResponseStatus,
				) && (
					<ProgressBar
						description={
							isCanceled ? 'This could take a few seconds.' : undefined
						}
						label={`Significance test: Simulations ${significanceTestsResult?.simulation_completed}/${significanceTestsResult?.total_simulations}`}
						percentage={significanceTestsResult?.percentage as number}
						startTime={significanceTestsResult?.startTime as Date}
						onCancel={() => (!isCanceled ? cancelRun() : undefined)}
					/>
				)}
		</>
	)
})
