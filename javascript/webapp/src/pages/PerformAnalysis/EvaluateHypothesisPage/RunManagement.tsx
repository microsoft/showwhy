/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { DefaultButton, Dropdown } from '@fluentui/react'
import { isProcessingStatus, isStatus } from '@showwhy/api-client'
import { ErrorMessage, ProgressBar } from '@showwhy/components'
import type { Handler, Handler1, Maybe, SignificanceTest } from '@showwhy/types'
import { NodeResponseStatus } from '@showwhy/types'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

export const RunManagement: React.FC<{
	significanceTestResult: Maybe<SignificanceTest>
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
	const showButton = useMemo((): any => {
		return (
			!significanceTestResult ||
			(significanceTestResult.status &&
				isStatus(significanceTestResult?.status, NodeResponseStatus.Failed))
		)
	}, [significanceTestResult])

	const isProcessing = useMemo((): any => {
		return (
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
			{showButton && (
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

			{significanceFailed && <ErrorMessage />}
			{isProcessing && (
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
