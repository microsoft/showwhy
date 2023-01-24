/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefaultButton } from '@fluentui/react'
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
`

export const SpinContainer = styled.div`
	margin-bottom: 10px;
`

export const ContainerAdvancedGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	column-gap: 10px;

	div {
		align-self: flex-end;
	}
`

export const ContainerAdvancedCheckbox = styled.div`
	margin: 10px 0px;
	display: flex;
	flex-direction: column;
	row-gap: 10px;
`

export const AdvancedButton = styled(DefaultButton)`
	margin-top: 10px;
	float: right;
`
