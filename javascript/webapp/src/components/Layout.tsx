/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataShaperApp } from '@datashaper/app-framework'
import { Spinner } from '@fluentui/react'
import { useConst } from '@fluentui/react-hooks'
import { DiscoveryProfilePlugin } from '@showwhy/discover-app'
import { EventAnalysisProfilePlugin } from '@showwhy/event-analysis-app'
import { ExposureProfilePlugin } from '@showwhy/model-exposure-app'
import { lazy, memo, Suspense } from 'react'

import { useExampleProjects } from '../hooks/examples.js'
import { Header } from './Header.js'
import { Container, Content, Main } from './Layout.styles.js'

const HomePage = lazy(() => import('../pages/HomePage.js'))

export const Layout: React.FC = memo(function Layout() {
	const examples = useExampleProjects()
	const profiles = useConst(() => [
		new DiscoveryProfilePlugin(),
		new EventAnalysisProfilePlugin(),
		new ExposureProfilePlugin(),
	])

	return (
		<Container id="layout">
			<Header />
			<Main>
				<Content>
					<Suspense fallback={<Spinner />}>
						<DataShaperApp profiles={profiles} examples={examples}>
							<HomePage onClickCard={arg => console.log('hey', arg)} />
						</DataShaperApp>
					</Suspense>
				</Content>
			</Main>
		</Container>
	)
})
