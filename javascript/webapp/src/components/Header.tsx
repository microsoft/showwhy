/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Container, Title } from './Header.styles.js'

export const Header: React.FC = memo(function Header() {
	const navigate = useNavigate()
	return (
		<Container>
			<Title onClick={() => navigate('/')}>ShowWhy</Title>
		</Container>
	)
})
