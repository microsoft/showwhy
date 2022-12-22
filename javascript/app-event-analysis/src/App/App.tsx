/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack } from '@fluentui/react'
import { memo } from 'react'

import { MainContent } from '../MainContent.js'
import { Container } from './App.styles.js'

export const App: React.FC = memo(function App() {
	return (
		<Container verticalFill grow>
			<Stack.Item grow className="container">
				<MainContent />
			</Stack.Item>
		</Container>
	)
})
