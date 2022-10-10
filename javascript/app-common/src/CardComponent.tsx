/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import {
	ButtonContainer,
	Card,
	CardContent,
	CardTitle,
} from './CardComponent.styles.js'

export const CardComponent: React.FC<{
	title?: string
	actionButtons?: React.ReactNode
	styles?: React.CSSProperties
	isSticky?: boolean
	noShaddow?: boolean
	children: React.ReactNode
}> = memo(function CardComponent({
	title,
	actionButtons,
	children,
	styles = {},
	isSticky = false,
	noShaddow,
}) {
	return (
		<Card noShaddow={noShaddow} isSticky={isSticky} style={styles}>
			{title || actionButtons ? (
				<CardTitle>
					{title || null}
					{actionButtons ? (
						<ButtonContainer>{actionButtons}</ButtonContainer>
					) : null}
				</CardTitle>
			) : null}
			<CardContent>{children}</CardContent>
		</Card>
	)
})
