/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isProcessingStatus } from '@showwhy/api-client'
import type { Handler, Maybe, SignificanceTest } from '@showwhy/types'
import { NodeResponseStatus, Significance } from '@showwhy/types'
import { memo } from 'react'

import { LinkCallout } from '~components/Callout'
import { ProgressBar } from '~components/ProgressBar'
import { Paragraph, Value } from '~styles'

import {
	confidenceIntervalCalloutLine1,
	confidenceIntervalCalloutLine2,
} from '../../../locales/en-US/perform-analysis'

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
				isProcessingStatus(significanceTestsResult.status!) && (
					<ProgressBar
						description={
							isCanceled ? 'This could take a few seconds.' : undefined
						}
						label={`Significance test: Simulations ${significanceTestsResult?.simulation_completed}/${significanceTestsResult?.total_simulations}`}
						percentage={significanceTestsResult?.percentage ?? 0}
						startTime={significanceTestsResult?.startTime ?? new Date()}
						onCancel={() => (!isCanceled ? cancelRun() : undefined)}
					/>
				)}
		</>
	)
})
