/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable  @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-return */

import { Spinner } from '@fluentui/react'
import { PersistenceProvider, TableStoreProvider } from '@showwhy/app-common'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import { ErrorBoundary } from './ErrorBoundary.js'
import { Layout } from './Layout.js'
import { StyleContext } from './StyleContext.js'

// @ts-ignore
const ModelExposurePage = lazy(
	() =>
		import(
			/* webpackChunkName: "ModelExposure" */
			'@showwhy/model-exposure-app'
		),
)

const ExplorePage = lazy(
	() =>
		import(
			/* webpackChunkName: "Explore" */
			'@showwhy/explore-app'
		),
)
const EventAnalysisPage = lazy(
	() =>
		import(
			/* webpackChunkName: "EventAnalysis" */
			'@showwhy/event-analysis-app'
		),
)
const WranglePage = lazy(
	() =>
		import(
			/* webpackChunkName: "Wrangle" */
			'@showwhy/wrangle-app'
		),
)

const HomePage = lazy(() => import('../pages/HomePage.js'))

export const App: React.FC = function App() {
	return (
		// <StrictMode> disabled for fluent
		<BrowserRouter>
			<StyleContext>
				<RecoilRoot>
					<TableStoreProvider>
						<PersistenceProvider>
							<ErrorBoundary>
								<Layout>
									<Suspense fallback={<Spinner />}>
										<Routes>
											<Route path="/" element={<HomePage />} />
											<Route path="wrangle/*" element={<WranglePage />} />
											<Route path="explore/*" element={<ExplorePage />} />
											<Route
												path="exposure/*"
												element={<ModelExposurePage />}
											/>
											<Route path="events/*" element={<EventAnalysisPage />} />
										</Routes>
									</Suspense>
								</Layout>
							</ErrorBoundary>
						</PersistenceProvider>
					</TableStoreProvider>
				</RecoilRoot>
			</StyleContext>
		</BrowserRouter>
		// </StrictMode>
	)
}
