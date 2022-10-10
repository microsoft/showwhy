/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { mergeStyles } from '@fluentui/react'
import styled from 'styled-components'

export const Row = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`
export const Container = styled.header`
	height: 39px;
	display: flex;
	align-content: center;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid #e1dfdd;
`
export const HeaderText = styled.h1`
	cursor: pointer;
	font-size: 1.4em;
	font-weight: 400;
	margin-left: 10px;
`
export const iconClass = mergeStyles({
	fontSize: 25,
	height: 25,
	width: 25,
	margin: '0 10px 0 5px',
	cursor: 'pointer',
})
