/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IconButton, TooltipHost } from '@fluentui/react'
import { useId } from '@fluentui/react-hooks'
import { StepTitle } from '@showwhy/components'
import type { Handler, Maybe, WorkflowStep } from '@showwhy/types'
import Markdown from 'markdown-to-jsx'
import { memo } from 'react'
import styled from 'styled-components'

import { useMarkdown } from '~hooks'

export const Guidance: React.FC<{
	isGuidanceVisible: boolean
	toggleGuidance: Handler
	step?: WorkflowStep
	maxHeight?: string
}> = memo(function Instructions({
	isGuidanceVisible,
	toggleGuidance,
	step,
	maxHeight = '100%',
}) {
	const tooltipId = useId('tooltip')
	const markdown = useMarkdown(step?.getMarkdown)

	return (
		<Container>
			<TitleContainer>
				<StepTitle title="Guidance" />
				<TooltipHost
					content={`${isGuidanceVisible ? 'Hide' : 'Show'} Guidance`}
					id={tooltipId}
					styles={styles.tooltipHost}
				>
					<Button
						onClick={toggleGuidance}
						iconProps={styles.button}
						aria-describedby={tooltipId}
					/>
				</TooltipHost>
			</TitleContainer>
			{markdown ? (
				<GuidanceText h={maxHeight} isVisible={isGuidanceVisible}>
					<Markdown>{markdown}</Markdown>
				</GuidanceText>
			) : (
				<GuidanceText
					h={maxHeight}
					isVisible={isGuidanceVisible}
					dangerouslySetInnerHTML={{ __html: step?.guidance || '' }}
				/>
			)}
		</Container>
	)
})

const Container = styled.div``

const GuidanceText = styled.div<{
	isVisible: Maybe<boolean>
	h: string
}>`
	padding: 0px 16px;
	transition: height 1.5s ease;
	height: ${({ isVisible, h }) => (isVisible ? `calc(${`${h} - 50px`})` : 0)};
	overflow: hidden auto;
`

const TitleContainer = styled.div`
	position: relative;
`

const Button = styled(IconButton)`
	position: absolute;
	right: 0;
	color: white;
`

const styles = {
	tooltipHost: {
		root: {
			position: 'absolute' as const,
			right: 0,
			padding: '0 15px',
			top: 0,
		},
	},
	button: { iconName: 'ReadingMode' },
}
