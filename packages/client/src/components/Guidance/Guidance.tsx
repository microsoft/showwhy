/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Markdown from 'markdown-to-jsx'
import { memo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { StepTitle } from '~components/StepTitle'
import { Step, Maybe } from '~types'

export const Guidance: React.FC<{
	isVisible: Maybe<boolean>
	step?: Step
}> = memo(function Instructions({ isVisible, step }) {
	const [markdown, setMarkdown] = useState('')

	useEffect(() => {
		setMarkdown('')
		if (step?.markdownPath) {
			import(`../../markdown/${step.markdownPath}`)
				.then(md => {
					setMarkdown(md.default)
				})
				.catch(console.error)
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
