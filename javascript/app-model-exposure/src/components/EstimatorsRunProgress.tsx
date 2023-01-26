/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Theme } from '@fluentui/react'
import { memo, useMemo } from 'react'
import Xarrow from 'react-xarrows'
import styled from 'styled-components'

import { NodeResponseStatus } from '../types/api/NodeResponseStatus.js'
import type { Handler } from '../types/primitives.js'
import type { RunHistory } from '../types/runs/RunHistory.js'
import type { RunStatus } from '../types/runs/RunStatus.js'
import { returnProgressStatus } from './EstimatorsRunProgress.utils.js'
import { ProgressBar } from './ProgressBar.js'
import { Container } from './styles.js'

interface LabelProps {
	id: string
	status: NodeResponseStatus
}

export const EstimatorsRunProgress: React.FC<{
	run: RunHistory
	runStatus: RunStatus
	props?: {
		label?: string
		description?: string
		percentComplete?: number
	}
	cancelRun?: Handler
	theme: Theme
}> = memo(function EstimatorsRunProgress({
	run,
	runStatus,
	props,
	cancelRun,
	theme,
}) {
	const hasConfidenceInterval = run.estimators.some((r) => r.confidenceInterval)
	const estimatorLabel: LabelProps = useMemo(() => {
		return {
			id: 'estimators',
			status: returnProgressStatus(
				runStatus.estimated_effect_completed,
				run.specCount,
			),
		}
	}, [runStatus, run])

	const confidenceIntervalLabel: LabelProps = useMemo(() => {
		return {
			id: 'confidenceInterval',
			status: returnProgressStatus(
				runStatus.confidence_interval_completed,
				run.confidenceIntervalCount,
			),
		}
	}, [runStatus, run])

	const refutersLabel: LabelProps = useMemo(() => {
		return {
			id: 'refuters',
			status: returnProgressStatus(runStatus.refute_completed, run.specCount),
		}
	}, [runStatus, run])

	return (
		<ContainerProgress>
			<ProgressIndicatorLabelWrapper>
				<ProgressIndicatorLabel status={estimatorLabel.status}>
					Estimators {runStatus.estimated_effect_completed}/{run.specCount}
				</ProgressIndicatorLabel>
				<Container>
					<Xarrow
						start={estimatorLabel.id}
						end={
							hasConfidenceInterval
								? confidenceIntervalLabel.id
								: refutersLabel.id
						}
						path="straight"
						color={theme.palette.neutralTertiaryAlt}
						headSize={7}
						strokeWidth={1}
					/>
				</Container>

				{hasConfidenceInterval && (
					<>
						<ProgressIndicatorLabel status={confidenceIntervalLabel.status}>
							Confidence Intervals {runStatus.confidence_interval_completed}/
							{run.confidenceIntervalCount}
						</ProgressIndicatorLabel>
						<Container>
							<Xarrow
								start={confidenceIntervalLabel.id}
								end={refutersLabel.id}
								path="straight"
								color={theme.palette.neutralTertiaryAlt}
								headSize={7}
								strokeWidth={1}
							/>
						</Container>
					</>
				)}
				<ProgressIndicatorLabel status={refutersLabel.status}>
					Refuters {runStatus.refute_completed}/{run.specCount}
				</ProgressIndicatorLabel>
			</ProgressIndicatorLabelWrapper>
			<ProgressIndicatorWrapper>
				<ProgressBar
					description={props?.description}
					percentage={runStatus.percentage}
					startTime={run.time?.start as Date}
					onCancel={cancelRun ? cancelRun : undefined}
				/>
			</ProgressIndicatorWrapper>
		</ContainerProgress>
	)
})

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

const ProgressIndicatorLabel = styled.div<{ status: NodeResponseStatus }>`
	padding: 0 0.5rem;
	font-weight: 500;
	font-size: 0.8rem;

	:first-child {
		padding-left: 0;
	}

	:last-child {
		padding-right: 0;
	}

	color: ${({
		theme,
		status,
	}: {
		theme: Theme
		status: NodeResponseStatus
	}) => {
		switch (status) {
			case NodeResponseStatus.Success:
				return 'limegreen'
			case NodeResponseStatus.Started:
				return theme.palette.themePrimary
			default:
				return theme.palette.neutralPrimary
		}
	}};
`
