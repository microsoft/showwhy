/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner, SpinnerSize } from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { StepStatus } from '~interfaces'

interface StepStatusDetailProps {
	status: StepStatus | undefined
}

export const StepStatusDetail: React.FC<StepStatusDetailProps> = memo(
	function StepStatusDetail({ status }) {
		const getStepStatus = useCallback(() => {
			switch (status) {
				case StepStatus.Done:
					return <Status color="success">Done</Status>
				case StepStatus.Error:
					return <Status color="error">Error</Status>
				case StepStatus.Loading:
					return <Spinner size={SpinnerSize.xSmall} />
				default:
					return <Status color="warning">To do</Status>
			}
		}, [status])

		return <>{getStepStatus()}</>
	},
)

const Status = styled.span<{ color: string }>`
	color: ${({ theme, color }) => theme.application()[color]};
	padding: 4px 8px;
`
