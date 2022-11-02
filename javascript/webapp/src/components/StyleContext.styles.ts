/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Theme } from '@fluentui/react'
import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
	* {
		box-sizing: border-box;
	}
	body {
		height: 100vh;
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
			'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
			sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		* {
			scrollbar-width: thin;
			scrollbar-color: #9d9d9d #f1f1f1;
		}

		*::-webkit-scrollbar {
			width: 12px;
			height: 12px
		}

		*::-webkit-scrollbar-track {
			background: #f1f1f1;
		}

		*::-webkit-scrollbar-thumb {
			background-color: #9d9d9d;
			border-radius: 10px;
			border: 2px solid #f1f1f1;
		}
	}

	:root {
		--faint: ${({ theme }: { theme: Theme }) => theme.palette.neutralLighter};
		--focus-border: ${({ theme }: { theme: Theme }) =>
			theme.palette.neutralTertiaryAlt};
		--separator-border: ${({ theme }: { theme: Theme }) =>
			theme.palette.neutralTertiaryAlt};
		
	}

	.header-command-bar {
		border: none;
	}
	
`
