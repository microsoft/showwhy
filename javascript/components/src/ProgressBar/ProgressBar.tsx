/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ProgressIndicator } from '@fluentui/react'
import { ActionButtons } from '@showwhy/components'
import type { Handler } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { Text } from '../styles'
import { useTimeElapsed } from './ProgressBar.hooks'

export const ProgressBar: React.FC<{
	percentage: number
	startTime: Date
	percentComplete?: number
	description?: string
	label?: string
	onCancel?: Handler
}> = memo(function ProgressBar({
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
			<ProgressIndicatorWrapper data-pw="progress-bar">
				<ProgressIndicator
					styles={{ root: { width: '100%' } }}
					description={
						<Text>
							{description ||
								`${
									startTime && percentage !== 100
										? 'Taking ' + timeElapsed
										: 'Finishing...'
								}`}
						</Text>
					}
					percentComplete={(percentComplete || percentage || 0) / 100}
				/>
				{onCancel ? <ActionButtons onCancel={onCancel} /> : null}
			</ProgressIndicatorWrapper>
		</>
	)
})

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
