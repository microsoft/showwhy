/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const DropdownContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.5rem;
	> * {
		min-width: 0;
	}
`

export const hypothesisGroupStyles = {
	root: {
		width: '100%',
	},
	flexContainer: {
		display: 'flex',
		justifyContent: 'space-between',
	},
}
