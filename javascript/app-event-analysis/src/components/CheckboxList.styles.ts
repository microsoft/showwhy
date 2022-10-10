/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isString } from 'lodash'
import styled from 'styled-components'

import type { CheckboxListProps } from './CheckboxList.types.js'

export const ListContainer = styled.div<Pick<CheckboxListProps, 'height'>>`
	overflow: auto;
	border: 1px solid #ccc;
	padding-top: 10px;
	height: ${p => (isString(p.height) ? p.height : p.height.toString() + 'px')};
	.itemContent {
		margin-left: 15px;
		margin-top: 2px;
		margin-bottom: 2px;
		&:hover {
			background: lightgray;
		}
	}
`
