/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, PrimaryButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { useGoToPage } from '~hooks'

export const StepControls: React.FC<{
	previousUrl: string
	nextUrl: string
}> = memo(function StepControls({ previousUrl, nextUrl }) {
	const handleNavigatePrev = useGoToPage(previousUrl)
	const handleNavigateNext = useGoToPage(nextUrl)
	return (
		<Container>
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
	padding: 8px 0px;
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
const NextButton = styled(PrimaryButton)`
	margin: 0px 8px;
	width: 100%;
`
