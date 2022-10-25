/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const FullScreenContainer = styled.div`
	height: calc(100vh - 100px);
	display: flex;
	flex-direction: column;
	padding: 0px;
`

export const ScrollableFullScreenContainer = styled(FullScreenContainer)`
	overflow: auto;
`

export const HalfHeightContainer = styled.div`
	flex: 0.5 0 50%;
	display: flex;
	flex-direction: column;
	overflow: auto;
	height: 100%;
`

export const FillContainer = styled.div`
	width: 100%;
	height: 100%;
	overflow: auto;
`
