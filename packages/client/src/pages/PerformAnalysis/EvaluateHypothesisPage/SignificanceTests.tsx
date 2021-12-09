/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import {
	confidenceIntervalCalloutLine1,
	confidenceIntervalCalloutLine2,
} from '../../../locales/en-US/perform-analysis'
import { LinkCallout } from '~components/Callout'
import { ProgressBar } from '~components/ProgressBar'
import { NodeResponseStatus, Significance } from '~enums'
import { SignificanceTest } from '~interfaces'
import { Paragraph, Value } from '~styles'
import { isOrchestratorProcessing } from '~utils'

interface SignificanceTestsProps {
	significanceTestsResult: SignificanceTest
}

export const SignificanceTests: React.FC<SignificanceTestsProps> = memo(
	function SignificanceTests({ significanceTestsResult }) {
		return (
			<>
				{significanceTestsResult?.status?.toLowerCase() ===
					NodeResponseStatus.Completed && (
					<Paragraph color="accent">
						Results of a statistical significance test shows that this effect
						size is
						<Value>
							<LinkCallout
								title={`${
									significanceTestsResult?.test_results?.significance ===
									Significance.NotSignificant
										? 'not '
										: ''
								} significantly different`}
								detailsTitle="Statistical Significance Test"
							>
								<Paragraph>{confidenceIntervalCalloutLine1}</Paragraph>
								<Paragraph>{confidenceIntervalCalloutLine2}</Paragraph>
							</LinkCallout>
						</Value>
						than that of the null distribution (
						{significanceTestsResult?.test_results?.p_value}).
					</Paragraph>
				)}

				{significanceTestsResult &&
					isOrchestratorProcessing(
						significanceTestsResult.status as string,
					) && (
						<ProgressBar
							label={`Significance test: simulations ${significanceTestsResult?.simulation_completed}/${significanceTestsResult?.total_simulations}`}
							percentage={significanceTestsResult?.percentage as number}
							startTime={significanceTestsResult?.startTime as Date}
						/>
					)}
			</>
		)
	},
)
