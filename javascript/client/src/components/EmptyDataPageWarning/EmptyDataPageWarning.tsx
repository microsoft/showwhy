/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '@showwhy/types'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ContainerTextCenter, Text } from '~styles'
import type { Pages } from '~types'

export const EmptyDataPageWarning: React.FC<{
	text: string
	linkText: string
	page: Pages
	marginTop?: Maybe<boolean>
}> = memo(function EmptyDataPageWarning({
	text,
	linkText,
	page,
	marginTop = false,
}) {
	return (
		<ContainerTextCenter marginTop={marginTop}>
			<Text>{text}</Text>

			<Link rel="noopener" to={page}>
				{linkText}
			</Link>
		</ContainerTextCenter>
	)
})
