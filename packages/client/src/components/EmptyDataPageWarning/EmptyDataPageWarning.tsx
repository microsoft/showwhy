/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Pages } from '~interfaces'
import { ContainerTextCenter, Text } from '~styles'

interface EmptyDataPageWarningProps {
	text: string
	linkText: string
	page: Pages
	marginTop?: boolean | undefined
}
export const EmptyDataPageWarning: React.FC<EmptyDataPageWarningProps> = memo(
	function EmptyDataPageWarning({ text, linkText, page, marginTop = false }) {
		return (
			<ContainerTextCenter marginTop={marginTop}>
				<Text>{text}</Text>

				<Link rel="noopener" to={page}>
					{linkText}
				</Link>
			</ContainerTextCenter>
		)
	},
)
