/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { FileTree } from './FileTree.js'
import { Header } from './Header.js'
import { Container, Content, fileTreeStyle, Main } from './Layout.styles.js'
import type { LayoutProps } from './Layout.types.js'

export const Layout: React.FC<LayoutProps> = memo(function Layout({
	children,
}) {
	return (
		<Container id="layout">
			<Header />
			<Main>
				<Content>
					<FileTree style={fileTreeStyle} />
					{children}
				</Content>
			</Main>
		</Container>
	)
})
