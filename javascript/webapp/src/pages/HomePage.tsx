/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDataPackage } from '@datashaper/app-framework'
import type { Resource } from '@datashaper/workflow'
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
import type { HomePageProps } from './HomePage.types.js'

const HomePage: React.FC<HomePageProps> = memo(function HomePage({ profiles }) {
	const dataPackage = useDataPackage()
	const cards = topLevelQuestionCards.map(d => {
		const profile = profiles.find(p => p.profile === d.key)
		if (!profile) {
			return null
		}
		return (
			<DocumentCard
				key={d.key}
				onClick={() => {
					const resource: Resource | undefined = profile.createResource?.()
					if (resource != null) {
						resource.name = dataPackage.suggestResourceName(resource.name)
						dataPackage.addResource(resource)
					}
				}}
				style={documentCardStyle}
			>
				<DocumentCardPreview
					styles={documentPreviewStyle}
					{...d.previewProps}
				/>
				<DocumentCardTitle
					title={d.heroTitle}
					styles={documentCardTitleStyles}
				/>
				<DocumentCardTitle
					showAsSecondaryTitle
					title={d.title}
					styles={documentCardTitleStyles}
				/>
			</DocumentCard>
		)
	})
	return <Container>{cards}</Container>
})
export default HomePage
