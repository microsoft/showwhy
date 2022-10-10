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
import { Container, DocumentCardStyle } from './HomePage.styles.js'

const HomePage: React.FC = memo(function HomePage() {
	const cards = topLevelQuestionCards.map(d => (
		<DocumentCard
			key={d.questionType}
			onClickHref={d.href}
			style={DocumentCardStyle}
		>
			<DocumentCardPreview {...d.previewProps} />
			<DocumentCardTitle title={d.title} />
		</DocumentCard>
	))
	return <Container>{cards}</Container>
})
export default HomePage
