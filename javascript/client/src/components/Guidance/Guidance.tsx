/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, TooltipHost } from '@fluentui/react'
import { useId } from '@fluentui/react-hooks'
import type { Maybe } from '@showwhy/types'
import Markdown from 'markdown-to-jsx'
import { memo } from 'react'
import styled from 'styled-components'

import { StepTitle } from '~components/StepTitle'
import { useMarkdown } from '~hooks'
import { useGuidance } from '~state'
import type { WorkflowStep } from '~types'

export const Guidance: React.FC<{
	step?: WorkflowStep
}> = memo(function Instructions({ step }) {
	const [isGuidanceVisible, toggleGuidance] = useGuidance()
	const tooltipId = useId('tooltip')
	const markdown = useMarkdown(step)

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
				<GuidanceText isVisible={isGuidanceVisible}>
					<Markdown>{markdown}</Markdown>
				</GuidanceText>
			) : (
				<GuidanceText
					isVisible={isGuidanceVisible}
					dangerouslySetInnerHTML={{ __html: step?.guidance || '' }}
				/>
			)}
		</Container>
	)
})

const Container = styled.div`
	height: 100%
`

const GuidanceText = styled.div<{
	isVisible: Maybe<boolean>
}>`
	padding: 0px 16px;
	transition: height 1.5s ease;
	height: ${({ isVisible }) => (isVisible ? 'calc(100% - 40px)' : 0)};
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
