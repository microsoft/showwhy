/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { mergeStyleSets } from '@fluentui/react'
import styled from 'styled-components'
import {
	colorCorrelation,
	colorNegative,
	colorPositive,
} from '../../styles/styles.js'

export const Background = styled.div({
	position: 'absolute',
	minHeight: '100%',
	minWidth: '100%',
})

export const Container = styled.div``

export const FlexContainer = styled.div`
	height: 98%;
	display: flex;
	flex-direction: column;
	justify-content: end;
	padding: 10px;
`

export const classNames = mergeStyleSets({
	positive: [{ color: colorPositive }],
	negative: [{ color: colorNegative }],
	correlation: [{ color: colorCorrelation }],
})
