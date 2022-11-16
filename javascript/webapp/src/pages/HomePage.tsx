/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DocumentCard,
	DocumentCardPreview,
	DocumentCardTitle,
} from '@fluentui/react/lib/DocumentCard'
import { memo } from 'react'

import { topLevelQuestionCards } from './HomePage.constants.js'
import {
	Container,
	documentCardStyle,
	documentCardTitleStyles,
	documentPreviewStyle,
} from './HomePage.styles.js'

export interface HomePageProps {
	onClickCard: (key: string) => void
}
const HomePage: React.FC<HomePageProps> = memo(function HomePage({
	onClickCard,
}) {
	const cards = topLevelQuestionCards.map(d => (
		<DocumentCard
			key={d.questionType}
			onClick={() => onClickCard(d.key)}
			style={documentCardStyle}
		>
			<DocumentCardPreview styles={documentPreviewStyle} {...d.previewProps} />
			<DocumentCardTitle title={d.heroTitle} styles={documentCardTitleStyles} />
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
