/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { DefaultButton, Dropdown } from '@fluentui/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { isProcessingStatus } from '../api-client/utils.js'
import type { NodeResponseStatus } from '../types/api/NodeResponseStatus.js'
import type { SignificanceTestStatus } from '../types/api/SignificanceTestStatus.js'
import type { Handler, Handler1, Maybe } from '../types/primitives.js'
import { percentage } from '../utils/stats.js'
import { ErrorInfo } from './ErrorInfo.js'
import { ProgressBar } from './ProgressBar.js'

export const RunManagement: React.FC<{
	significanceTestResult: Maybe<SignificanceTestStatus>
	significanceFailed: boolean
	runSignificance: Handler
	outcomeOptions: IDropdownOption[]
	selectedOutcome: string
	setSelectedOutcome: Handler1<string>
	isCanceled: boolean
	cancelRun: Handler
	hasAnyProcessingActive: boolean
}> = memo(function RunManagement({
	significanceTestResult,
	significanceFailed,
	runSignificance,
	outcomeOptions,
	selectedOutcome,
	setSelectedOutcome,
	isCanceled,
	cancelRun,
	hasAnyProcessingActive,
}) {
	const isProcessing = useMemo((): boolean => {
		return !!(
			significanceTestResult &&
			isProcessingStatus(significanceTestResult.status as NodeResponseStatus)
		)
	}, [significanceTestResult])

	return (
		<Container>
			{outcomeOptions.length > 1 && (
				<DropdownContainer>
					<Dropdown
						label="Outcome"
						disabled={outcomeOptions.length <= 2}
						selectedKey={selectedOutcome}
						onChange={(_, val) => setSelectedOutcome(val?.key as string)}
						options={outcomeOptions}
					/>
				</DropdownContainer>
			)}
			{!isProcessing && (
				<DefaultButton
					onClick={runSignificance}
					disabled={hasAnyProcessingActive}
					title={
						hasAnyProcessingActive
							? 'You must wait for the current run to end'
							: 'Run significance test for this outcome'
					}
					data-pw="run-significance-test-button"
				>
					Run significance test
				</DefaultButton>
			)}

			{significanceFailed && <ErrorInfo />}
			{isProcessing && (
				<ProgressBar
					description={
						isCanceled ? 'This could take a few seconds.' : undefined
					}
					label={`Significance test: Simulations ${
						significanceTestResult?.completed || 0
					}/100`}
					percentage={percentage(significanceTestResult?.completed, 100)}
					startTime={significanceTestResult?.startTime as Date}
					onCancel={() => (!isCanceled ? cancelRun() : undefined)}
				/>
			)}
		</Container>
	)
})

const Container = styled.div`
	margin-bottom: 4px;
	column-gap: 10px;
	display: flex;
	margin-top: 1em;
	align-items: flex-end;
`

const DropdownContainer = styled.div`
	width: 200px;
`
