/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ProgressIndicator } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { ActionButtons } from '~components/ActionButtons'
import { useTimeElapsed } from '~hooks'
import { Text } from '~styles'

interface ProgressBarProps {
	percentage: number
	startTime: Date
	percentComplete?: number
	description?: string
	label?: string
	onCancel?: () => void
}

export const ProgressBar: React.FC<ProgressBarProps> = memo(
	function ProgressBar({
		percentage,
		startTime,
		percentComplete,
		description,
		label,
		onCancel,
	}) {
		const timeElapsed = useTimeElapsed(startTime)

		return (
			<>
				{label && <ProgressIndicatorLabel>{label}</ProgressIndicatorLabel>}
				<ProgressIndicatorWrapper>
					<ProgressIndicator
						styles={{ root: { width: '100%' } }}
						description={
							<Text>
								{description ||
									`${percentage}%${
										startTime && percentage !== 100
											? ', taking ' + timeElapsed
											: ', finishing...'
									}`}
							</Text>
						}
						percentComplete={
							(percentComplete || percentage || 0) / 100 || undefined
						}
					/>
					{onCancel ? <ActionButtons onCancel={onCancel} /> : null}
				</ProgressIndicatorWrapper>
			</>
		)
	},
)

const ProgressIndicatorWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
`

const ProgressIndicatorLabel = styled.div`
	font-weight: 500;
	font-size: 0.8rem;

	color: ${({ theme }) => theme.application().accent};
`
