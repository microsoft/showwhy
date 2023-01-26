/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'

export const CardsContainer = styled.div`
	width: 200px;
`
export const BoxGroup = styled.div<{
	justifyContent?: string
	alignItems?: string
}>`
	display: flex;
	align-items: ${(props) => props.alignItems || 'center'};
	gap: 2rem;
	justify-content: ${(props) => props.justifyContent || 'flex-start'};
`

export const Container = styled.section`
	display: grid;
	grid-template-columns: 40% 30% auto;
	align-items: start;
	gap: 10px;
`

export const Div = styled.div``

export const CheckBoxWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	height: 32px;
`

export const Description = styled.div`
	margin-top: 5px;
`

export const SpinnerContainer = styled.div`
	width: 80px;
`

export const ConfigContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
`
