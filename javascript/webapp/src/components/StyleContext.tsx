/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SwatchRGB } from '@fluentui/web-components'
import { accentBaseColor } from '@fluentui/web-components'
import { loadById } from '@thematic/core'
import { loadFluentTheme, ThematicFluentProvider } from '@thematic/fluent'
import { ApplicationStyles, useThematic } from '@thematic/react'
import { memo, useEffect, useMemo } from 'react'
import { ThemeProvider } from 'styled-components'

import { GlobalStyle } from './StyleContext.styles.js'
import type { StyleContextProps } from './StyleContext.types.js'

export const StyleContext: React.FC<StyleContextProps> = memo(
	function StyleContext({ children }) {
		const theme = loadById('autumn', { dark: false })
		const fluentTheme = useMemo(() => loadFluentTheme(theme), [theme])
		return (
			<ThematicFluentProvider theme={theme} style={fluentProviderStyle}>
				<ApplicationStyles />
				<ThemeProvider theme={fluentTheme}>
					<GlobalStyle />
					<DesignTokenTheming />
					{children}
				</ThemeProvider>
			</ThematicFluentProvider>
		)
	},
)

const DesignTokenTheming: React.FC = () => {
	const theme = useThematic()
	useEffect(() => {
		const rgba = theme.application().accent().rgbav()
		accentBaseColor.withDefault({
			r: rgba[0],
			g: rgba[1],
			b: rgba[2],
		} as SwatchRGB)
	}, [theme])
	return null
}

const fluentProviderStyle = { height: '100%', width: '100%' }
