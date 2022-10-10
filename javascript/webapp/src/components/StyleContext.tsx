/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { loadFluentTheme, ThematicFluentProvider } from '@thematic/fluent'
import { ApplicationStyles, useThematic } from '@thematic/react'
import { memo, useMemo } from 'react'
import { ThemeProvider } from 'styled-components'

import { GlobalStyle } from './StyleContext.styles.js'
import type { StyleContextProps } from './StyleContext.types.js'

export const StyleContext: React.FC<StyleContextProps> = memo(
	function StyleContext({ children }) {
		const theme = useThematic()
		const fluentTheme = useMemo(() => loadFluentTheme(theme), [theme])
		return (
			<ThematicFluentProvider
				theme={theme}
				style={FluentProviderStyle}
			>
				<ApplicationStyles />
				<ThemeProvider theme={fluentTheme}>
					<GlobalStyle />
					{children}
				</ThemeProvider>
			</ThematicFluentProvider>
		)
	},
)

const FluentProviderStyle = { height: '100%', width: '100%' }