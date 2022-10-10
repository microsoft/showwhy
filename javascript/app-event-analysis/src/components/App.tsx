/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack } from '@fluentui/react'
import { memo } from 'react'

import { Container } from './App.styles.js'
import { MainContent } from './MainContent.js'

export const App: React.FC = memo(function App() {
	return (
		<Container verticalFill grow>
			<Stack.Item grow className="container">
				<MainContent />
			</Stack.Item>
		</Container>
	)
})
