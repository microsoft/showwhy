/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
`
export const Main = styled.main`
	flex: 1;
	display: flex;
	flex-direction: row;
	max-height: calc(100vh - 40px);
	max-width: 100%;
	min-height: calc(100vh - 40px);
`
export const Content = styled.article`
	flex: 1;
	display: flex;
	overflow: hidden;
	max-height: 100%;
	max-width: 100%;
`

export const fileTreeStyle = { borderRight: '1px solid #CCC' }
