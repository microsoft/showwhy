/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable  @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-return */

import {
	PersistenceProvider,
	TableStoreProvider,
} from '@datashaper/app-framework'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import { ErrorBoundary } from './ErrorBoundary.js'
import { Layout } from './Layout.js'
import { StyleContext } from './StyleContext.js'

export const App: React.FC = function App() {
	return (
		// <StrictMode> disabled for fluent
		<BrowserRouter>
			<StyleContext>
				<TableStoreProvider>
					<RecoilRoot>
						<PersistenceProvider>
							<ErrorBoundary>
								<Layout />
							</ErrorBoundary>
						</PersistenceProvider>
					</RecoilRoot>
				</TableStoreProvider>
			</StyleContext>
		</BrowserRouter>
		// </StrictMode>
	)
}
