/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DocumentCard,
	DocumentCardPreview,
	DocumentCardTitle,
} from '@fluentui/react/lib/DocumentCard'
import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { topLevelQuestionCards } from './HomePage.constants.js'
import {
	Container,
	documentCardStyle,
	documentCardTitleStyles,
	documentPreviewStyle,
} from './HomePage.styles.js'

const HomePage: React.FC = memo(function HomePage() {
	const navigate = useNavigate()

	const onClick = useCallback(
		(route: string) => {
			navigate(route)
		},
		[navigate],
	)

	const cards = topLevelQuestionCards.map(d => (
		<DocumentCard
			key={d.questionType}
			onClick={() => onClick(d.href)}
			style={documentCardStyle}
		>
			<DocumentCardPreview styles={documentPreviewStyle} {...d.previewProps} />
			<DocumentCardTitle title={d.heroTitle} />
			<DocumentCardTitle
				showAsSecondaryTitle
				title={d.title}
				styles={documentCardTitleStyles}
			/>
		</DocumentCard>
	))
	return <Container>{cards}</Container>
})
export default HomePage
