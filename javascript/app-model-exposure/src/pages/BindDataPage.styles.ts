/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'

export const Container = styled.div`
	height: 99%;
	margin-top: 5px;
	position: relative;
	overflow-y: auto;

	> div {
		padding: 0;
	}
`

export const PrepareDataContainer = styled.div`
	height: 90%;
`

export const ActionsContainer = styled.div`
	display: flex;
	justify-content: space-between;
`

export const commandBarStyles = { root: { width: 200, paddingBottom: 13 } }
