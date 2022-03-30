/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, Spinner, SpinnerSize } from '@fluentui/react'
import type { Handler, Maybe } from '@showwhy/types'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import { StepStatus } from '~types'

export const StepStatusDetail: React.FC<{
	status: Maybe<StepStatus>
	toggleStatus: Handler
}> = memo(function StepStatusDetail({ status, toggleStatus }) {
	const getStepStatus = useCallback(() => {
		switch (status) {
			case StepStatus.Done:
				return (
					<Status color="success">
						<IconButton onClick={toggleStatus} iconProps={iconProps.done} />
					</Status>
				)
			case StepStatus.Error:
				return (
					<Status color="error">
						<IconButton iconProps={iconProps.error} />
					</Status>
				)
			case StepStatus.Loading:
				return <Spinner size={SpinnerSize.xSmall} />
			default:
				return (
					<Status color="warning">
						<IconButton onClick={toggleStatus} iconProps={iconProps.todo} />
					</Status>
				)
		}
	}, [status, toggleStatus])

	return <>{getStepStatus()}</>
})

const Status = styled.span<{ color: string }>`
	color: ${({ theme, color }) => theme.application()[color]};
`

const iconProps = {
	done: { iconName: 'SkypeCircleCheck' },
	todo: { iconName: 'CircleRing' },
	error: { iconName: 'StatusCircleExclamation' },
}
