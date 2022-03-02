/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Icon, PrimaryButton } from '@fluentui/react'
import type { Maybe, Handler } from '@showwhy/types'
import { memo } from 'react'

import styled from 'styled-components'
import { useGoToPage } from '~hooks'
import { Step, StepStatus } from '~types'

export const StepControls: React.FC<{
	step?: Step
	stepStatus?: StepStatus
	toggleStatus: Handler
	previousUrl: string
	nextUrl: string
}> = memo(function StepControls({
	step,
	stepStatus,
	toggleStatus,
	previousUrl,
	nextUrl,
}) {
	const handleNavigatePrev = useGoToPage(previousUrl)
	const handleNavigateNext = useGoToPage(nextUrl)
	return (
		<Container>
			<MarkDoneButton
				done={stepStatus === StepStatus.Done}
				disabled={!step?.showStatus}
				onClick={toggleStatus}
			>
				<Icon iconName="CheckMark"></Icon>Mark as
				{stepStatus === StepStatus.Done ? ' to do' : ' done'}
			</MarkDoneButton>
			<PreviousButton onClick={handleNavigatePrev} disabled={!previousUrl}>
				Previous step
			</PreviousButton>
			<NextButton onClick={handleNavigateNext} disabled={!nextUrl}>
				Next step
			</NextButton>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	justify-content: center;
	padding: 16px 0px;
	position: sticky;
	bottom: 0rem;
	width: 100%;
	background-color: white;
	z-index: 2;
	box-shadow: 0px 0px 6px -2px rgb(0 0 0 / 25%);
`

const PreviousButton = styled(DefaultButton)`
	margin: 0px 8px;
	width: 100%;
`

const MarkDoneButton = styled(DefaultButton)<{ done: Maybe<boolean> }>`
	margin: 0px 8px;
	width: 50%;

	&:not([disabled]) {
		color: ${({ theme, done }) =>
			!done ? theme.application().accent : theme.application().warning};
	}
`

const NextButton = styled(PrimaryButton)`
	margin: 0px 8px;
	width: 100%;
`
