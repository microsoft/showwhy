/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { type ResourceTreeData, DataShaperApp } from '@datashaper/app-framework'
import { memo } from 'react'

import { useExampleProjects } from '../hooks/examples.js'
import { pages } from '../pages.js'
import { Header } from './Header.js'
import { Container, Main } from './Layout.styles.js'
import type { LayoutProps } from './Layout.types.js'

export const Layout: React.FC<LayoutProps> = memo(function Layout({
	children,
}) {
	const examples = useExampleProjects()
	return (
		<Container id="layout">
			<Header />
			<Main>
				<DataShaperApp examples={examples.examples} appResources={appResources}>
					{children}
				</DataShaperApp>
			</Main>
		</Container>
	)
})

const appResources: ResourceTreeData[] = [
	{
		title: 'Causal Discovery',
		icon: pages.discover.icon,
		route: `/${pages.discover.route}`,
	},
	{
		title: 'Exposure Analysis',
		icon: pages.exposure.icon,
		route: `/${pages.exposure.route}`,
	},
	{
		title: 'Event Analysis',
		icon: pages.events.icon,
		route: `/${pages.events.route}`,
	},
]
