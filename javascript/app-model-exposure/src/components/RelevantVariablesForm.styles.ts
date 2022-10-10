/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { TextField } from '@fluentui/react'
import styled from 'styled-components'

export const Container = styled.form`
	display: grid;
	grid-template-columns: 30% 60% 10%;
	align-items: center;
	padding: 0.5rem 0.2rem;
	border-radius: 0 0 3px 3px;
	background-color: #f1f1f1;
	margin-top: 0.1rem;
`

export const Field = styled(TextField)`
	margin: 0;
	padding: 0 0.5rem;
`

export const ButtonContainer = styled.div`
	text-align: center;
	padding-right: 8px;
`
