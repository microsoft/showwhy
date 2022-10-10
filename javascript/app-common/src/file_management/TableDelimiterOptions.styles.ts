/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ChoiceGroup, TextField } from '@fluentui/react'
import styled from 'styled-components'

export const RadioGroup = styled(ChoiceGroup)`
	.ms-ChoiceField-field {
		display: flex;
		align-items: center;
	}
`

export const Container = styled.div`
	display: flex;
	gap: 10px;
`

export const OtherTextField = styled(TextField)`
	width: 50px;
`

export const choiceGroupStyles = {
	flexContainer: {
		display: 'flex',
		gap: '5px',
	},
}
