/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ThematicFluentProvider } from '@thematic/fluent'
import { ApplicationStyles, useThematic } from '@thematic/react'

import { memo } from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

export const StyleContext: React.FC = memo(function StyleContext({ children }) {
	const thematicTheme = useThematic()

	return (
		<>
			<GlobalStyle />
			<ThematicFluentProvider theme={thematicTheme}>
				<ApplicationStyles />

				<ThemeProvider theme={thematicTheme}>{children}</ThemeProvider>
			</ThematicFluentProvider>
		</>
	)
})

const GlobalStyle = createGlobalStyle`
	body {
		height: 100vh;
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
			'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
			sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
`
