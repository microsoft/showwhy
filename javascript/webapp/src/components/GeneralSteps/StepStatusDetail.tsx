/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, Spinner, SpinnerSize } from '@fluentui/react'
import type { Handler, Maybe } from '@showwhy/types'
import { StepStatus } from '@showwhy/types'
import { memo } from 'react'
import { Case, Default, Switch } from 'react-if'
import styled from 'styled-components'

export const StepStatusDetail: React.FC<{
	status: Maybe<StepStatus>
	toggleStatus: Handler
}> = memo(function StepStatusDetail({ status, toggleStatus }) {
	return (
		<>
			<Switch>
				<Case condition={status === StepStatus.Done}>
					<Status color="success">
						<IconButton onClick={toggleStatus} iconProps={iconProps.done} />
					</Status>
				</Case>
				<Case condition={status === StepStatus.Error}>
					<Status color="error">
						<IconButton iconProps={iconProps.error} />
					</Status>
				</Case>
				<Case condition={status === StepStatus.Loading}>
					<Spinner size={SpinnerSize.xSmall} />
				</Case>
				<Default>
					<Status color="warning">
						<IconButton onClick={toggleStatus} iconProps={iconProps.todo} />
					</Status>
				</Default>
			</Switch>
		</>
	)
})

const Status = styled.span<{ color: string }>`
	color: ${({ theme, color }) => theme.application()[color]};
`

const iconProps = {
	done: { iconName: 'SkypeCircleCheck' },
	todo: { iconName: 'CircleRing' },
	error: { iconName: 'StatusCircleExclamation' },
}
