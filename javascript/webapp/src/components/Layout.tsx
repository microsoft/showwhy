/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { type ResourceTreeData, DataShaperApp } from '@datashaper/app-framework'
import { Spinner } from '@fluentui/react'
import { DiscoveryPersistenceProvider } from '@showwhy/discover-app'
import { EventsPersistenceProvider } from '@showwhy/event-analysis-app'
import { ModelExposurePersistenceProvider } from '@showwhy/model-exposure-app'
import { lazy, memo, Suspense, useCallback, useState } from 'react'

import { useExampleProjects } from '../hooks/examples.js'
import { pages } from '../pages.js'
import { Header } from './Header.js'
import { Container, Content, Main } from './Layout.styles.js'

const ExposureApp = lazy(
	() =>
		import(
			/* webpackChunkName: "ModelExposure" */
			'@showwhy/model-exposure-app'
		),
)

const DiscoverApp = lazy(
	() =>
		import(
			/* webpackChunkName: "Explore" */
			'@showwhy/discover-app'
		),
)
const EventsApp = lazy(
	() =>
		import(
			/* webpackChunkName: "EventAnalysis" */
			'@showwhy/event-analysis-app'
		),
)

const HomePage = lazy(() => import('../pages/HomePage.js'))

const HANDLERS = {
	discover: DiscoverApp,
	exposure: ExposureApp,
	events: EventsApp,
}

export const Layout: React.FC = memo(function Layout() {
	const examples = useExampleProjects()
	const [selectedKey, setSelectedKey] = useState<string | undefined>()
	const onSelectItem = useCallback(
		(v: ResourceTreeData) => {
			setSelectedKey(v.key)
		},
		[setSelectedKey],
	)

	return (
		<Container id="layout">
			<Header />
			<Main>
				<Content>
					<>
						{/* Application Persistence Utilities */}
						<ModelExposurePersistenceProvider />
						<DiscoveryPersistenceProvider />
						<EventsPersistenceProvider />
					</>
					<Suspense fallback={<Spinner />}>
						<DataShaperApp
							handlers={HANDLERS}
							examples={examples}
							appResources={appResources}
							selectedKey={selectedKey}
							frontPage={() => <HomePage onClickCard={setSelectedKey} />}
							onSelect={onSelectItem}
						>
							<HomePage onClickCard={setSelectedKey} />
						</DataShaperApp>
					</Suspense>
				</Content>
			</Main>
		</Container>
	)
})

const appResources: ResourceTreeData[] = [
	{
		title: 'Causal Discovery',
		icon: pages.discover.icon,
		key: `${pages.discover.route}`,
	},
	{
		title: 'Exposure Analysis',
		icon: pages.exposure.icon,
		key: `${pages.exposure.route}`,
	},
	{
		title: 'Event Analysis',
		icon: pages.events.icon,
		key: `${pages.events.route}`,
	},
]
