/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Theme } from '@thematic/core'
import { memo, useMemo } from 'react'
import Xarrow from 'react-xarrows'
import styled from 'styled-components'
import { ProgressBar } from '~components/ProgressBar'
import { NodeResponseStatus } from '~enums'
import { RunHistory } from '~interfaces'
import { Container } from '~styles'

interface RunProgressIndicatorProps {
	run: RunHistory
	props?: {
		label?: string
		description?: string
		percentComplete?: number
	}
	cancelRun?: () => void
	theme: Theme
}

interface LabelProps {
	id: string
	status: string
}

export const RunProgressIndicator: React.FC<RunProgressIndicatorProps> = memo(
	function RunProgressIndicator({ run, props, cancelRun, theme }) {
		const estimatorLabel: LabelProps = useMemo(() => {
			return {
				id: 'estimators',
				status: run.status?.estimators?.status || '',
			}
		}, [run])

		const confidenceIntervalLabel: LabelProps = useMemo(() => {
			return {
				id: 'confidenceInterval',
				status: run.status?.confidenceIntervals?.status || '',
			}
		}, [run])

		const refutersLabel: LabelProps = useMemo(() => {
			return {
				id: 'refuters',
				status: run.status?.refuters?.status || '',
			}
		}, [run])

		return (
			<ContainerProgress>
				<ProgressIndicatorLabelWrapper>
					<ProgressIndicatorLabel {...estimatorLabel}>
						Estimators {run.status?.estimated_effect_completed}
					</ProgressIndicatorLabel>
					<Container>
						<Xarrow
							start={estimatorLabel.id}
							end={
								run.hasConfidenceInterval
									? confidenceIntervalLabel.id
									: refutersLabel.id
							}
							path="straight"
							color={theme.application().border().hex()}
							headSize={7}
							strokeWidth={1}
						/>
					</Container>
					{run.hasConfidenceInterval && (
						<>
							<ProgressIndicatorLabel {...confidenceIntervalLabel}>
								Confidence Intervals {run.status?.confidence_interval_completed}
							</ProgressIndicatorLabel>
							<Container>
								<Xarrow
									start={confidenceIntervalLabel.id}
									end={refutersLabel.id}
									path="straight"
									color={theme.application().border().hex()}
									headSize={7}
									strokeWidth={1}
								/>
							</Container>
						</>
					)}
					<ProgressIndicatorLabel {...refutersLabel}>
						Refuters {run.status?.refute_completed}
					</ProgressIndicatorLabel>
				</ProgressIndicatorLabelWrapper>
				<ProgressIndicatorWrapper>
					<ProgressBar
						description={props?.description}
						percentage={run.status?.percentage as number}
						percentComplete={props?.percentComplete || run.status?.percentage}
						startTime={run.status?.time?.start as Date}
						onCancel={cancelRun ? cancelRun : undefined}
					/>
				</ProgressIndicatorWrapper>
			</ContainerProgress>
		)
	},
)

const ContainerProgress = styled.div`
	width: 100%;
`

const ProgressIndicatorWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
`

const ProgressIndicatorLabelWrapper = styled.div`
	display: flex;
	justify-content: space-between;
`

const ProgressIndicatorLabel = styled.div<{ status: string }>`
	padding: 0 0.5rem;
	font-weight: 500;
	font-size: 0.8rem;

	:first-child {
		padding-left: 0;
	}

	:last-child {
		padding-right: 0;
	}

	color: ${({ status, theme }) => {
		switch (status) {
			case NodeResponseStatus.Completed:
				return 'limegreen'
			case NodeResponseStatus.Running:
				return theme.application().accent
			default:
				return theme.application().highContrast
		}
	}};
`
