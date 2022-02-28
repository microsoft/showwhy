/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '@showwhy/types'
import Markdown from 'markdown-to-jsx'
import { memo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { StepTitle } from '~components/StepTitle'
import type { Step } from '~types'

export const Guidance: React.FC<{
	isVisible: Maybe<boolean>
	step?: Step
}> = memo(function Instructions({ isVisible, step }) {
	const [markdown, setMarkdown] = useState('')

	useEffect(() => {
		if (step?.getMarkdown) {
			step
				?.getMarkdown()
				.then(({ default: md }: { default: string }) => {
					setMarkdown(md)
				})
				.catch(error => {
					console.error('Error importing guidance:', error)
					setMarkdown('')
				})
		} else {
			setMarkdown('')
		}
	}, [step])
	return isVisible ? (
		<>
			<TitleContainer>
				<StepTitle title="Guidance" />
			</TitleContainer>
			{markdown ? (
				<GuidanceText>
					<Markdown>{markdown}</Markdown>
				</GuidanceText>
			) : (
				<GuidanceText
					dangerouslySetInnerHTML={{ __html: step?.guidance || '' }}
				/>
			)}
		</>
	) : null
})

const GuidanceText = styled.div`
	padding: 0px 16px;
	overflow: auto;
	max-height: 95%;
`

const TitleContainer = styled.div`
	position: relative;
`
