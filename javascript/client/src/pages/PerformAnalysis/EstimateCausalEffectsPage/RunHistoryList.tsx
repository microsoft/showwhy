/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Icon } from '@fluentui/react'
import { isProcessingStatus } from '@showwhy/api-client'
import type { Handler, NodeResponseStatus } from '@showwhy/types'
import { useThematic } from '@thematic/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { ErrorMessage } from '~components/ErrorMessage'
import { RunProgressIndicator } from '~components/RunProgressIndicator'
import { ContainerFlexColumn, Text, Title } from '~styles'
import type { RunHistory } from '~types'
import { elapsedTime } from '~utils'

export const RunHistoryList: React.FC<{
	setRunAsDefault: (run: RunHistory) => void
	loadingSpecCount: boolean
	loadingFile: boolean
	specCount?: number
	cancelRun?: Handler
	runHistory: RunHistory[]
	errors?: string
	isCanceled: boolean
}> = memo(function RunHistoryList({
	specCount = 0,
	loadingSpecCount,
	loadingFile,
	runHistory,
	errors,
	setRunAsDefault,
	cancelRun,
	isCanceled,
}) {
	const theme = useThematic()

	const runHistorySorted = useMemo((): RunHistory[] => {
		const history = [...runHistory]
		return history?.sort(function (a, b) {
			return a?.runNumber - b?.runNumber
		})
	}, [runHistory])

	return (
		<TableContainer data-pw="available-estimates-table">
			<Title>Estimates Available</Title>
			<Table>
				<TableHead>
					<Tr>
						<Th>
							<ColumnName>Run</ColumnName>
						</Th>
						<Th>
							<ColumnName>Estimates available</ColumnName>
						</Th>
						<Th>
							<ColumnName>Explore</ColumnName>
						</Th>
					</Tr>
				</TableHead>
				<TableBody>
					{runHistorySorted.length > 0 &&
						runHistorySorted.map(run => (
							<Tr key={run.runNumber} data-pw="run">
								<Td>{run.runNumber}</Td>
								<Td>
									{isProcessingStatus(
										run?.status?.status as NodeResponseStatus,
									) ? (
										<RunProgressIndicator
											run={run}
											theme={theme}
											cancelRun={
												!isCanceled && run.isActive && cancelRun
													? cancelRun
													: undefined
											}
											props={
												isCanceled && run.isActive
													? {
															label: 'Canceling run...',
															description: 'This could take a few seconds.',
															percentComplete: undefined,
													  }
													: undefined
											}
										/>
									) : (
										<ContainerFlexColumn>
											{!run.id && '-/' + specCount}
											{run.status?.estimated_effect_completed &&
												`${run.status?.estimated_effect_completed} available${
													run.status.time?.end
														? `, took ${elapsedTime(
																run.status.time?.start,
																run.status.time?.end,
														  )}`
														: ''
												}`}
											{run.status?.error && (
												<ErrorMessage message={run.status?.error} />
											)}
										</ContainerFlexColumn>
									)}
								</Td>
								<Td>
									<DefaultButton
										onClick={() => setRunAsDefault(run)}
										disabled={run.isActive || !!run.status?.error}
										checked={run.isActive}
									>
										{run.isActive ? (
											<Icon iconName="CheckMark" />
										) : (
											'Set active'
										)}
									</DefaultButton>
								</Td>
							</Tr>
						))}
					{!runHistory.find(run =>
						isProcessingStatus(run?.status?.status as NodeResponseStatus),
					) && (
						<Tr>
							<Td> {runHistory.length + 1} </Td>
							<Td>
								{loadingSpecCount ? (
									<Text>Loading specifications count...</Text>
								) : loadingFile ? (
									<Text>Preparing server...</Text>
								) : errors ? (
									<Text>{!!errors && <ErrorMessage message={errors} />}</Text>
								) : (
									<Text>{'-/' + specCount} available</Text>
								)}
							</Td>
							<Td>-</Td>
						</Tr>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	)
})

const Td = styled.td`
	padding: 6px 6px;
	display: flex;
	align-items: center;
	justify-content: center;
`

const TableContainer = styled.div`
	padding: 8px;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 4px;
	margin-top: 16px;
`
const Table = styled.table`
	border-radius: 2px;
	width: 100%;
	border-collapse: collapse;
	display: table;
`

const TableHead = styled.thead`
	text-align: left;
`
const TableBody = styled.tbody``
const Tr = styled.tr`
	display: grid;
	grid-template-columns: 1fr 4fr 1fr;
`

const Th = styled.th`
	padding: 0px 8px;
`

const ColumnName = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: center;
`
