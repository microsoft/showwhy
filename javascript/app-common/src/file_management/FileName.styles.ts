/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Label } from '@fluentui/react'
import styled from 'styled-components'

export const LabelName = styled(Label)`
	display: flex;
	align-items: center;
`

export const FileNameContainer = styled.div`
	display: flex;
	justify-content: space-between;
	width: 65%;
	gap: 5px;

	.ms-TextField {
		width: 88%;
	}
`
