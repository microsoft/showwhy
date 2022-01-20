/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Icon, PrimaryButton } from '@fluentui/react'
import React, { memo } from 'react'

import styled from 'styled-components'
import { StepStatus } from '~enums'
import { Step } from '~interfaces'

interface StepControlsProps {
	step?: Step
	stepStatus?: StepStatus
	goToPage: (url: string) => void
	toggleStatus: () => void
	previousUrl: string
	nextUrl: string
}

export const StepControls: React.FC<StepControlsProps> = memo(
	function StepControls({
		step,
		stepStatus,
		goToPage,
		toggleStatus,
		previousUrl,
		nextUrl,
	}) {
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
				<PreviousButton
					onClick={() => goToPage(previousUrl)}
					disabled={!previousUrl}
				>
					Previous step
				</PreviousButton>
				<NextButton onClick={() => goToPage(nextUrl)} disabled={!nextUrl}>
					Next step
				</NextButton>
			</Container>
		)
	},
)

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

const MarkDoneButton = styled(DefaultButton)<{ done: boolean | undefined }>`
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
