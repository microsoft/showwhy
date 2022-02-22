/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IDropdownOption, IRenderFunction } from '@fluentui/react'
import { useCallback } from 'react'
import styled from 'styled-components'
import { Text } from '~styles'
import { Maybe, VariableAssignedCount } from '~types'

export function useRenderDropdownTitle(
	assignedCount: Maybe<VariableAssignedCount>,
): IRenderFunction<IDropdownOption<any>[]> | undefined {
	return useCallback(
		(props?, defaultRender?) => {
			if (!props || !defaultRender) {
				return null
			}
			const option = props[0]

			return (
				<Option>
					<Count>
						{option && assignedCount?.assigned + '/' + assignedCount?.total}
					</Count>
					<Text>{option.text}</Text>
				</Option>
			)
		},
		[assignedCount],
	)
}

const Option = styled.div`
	width: 100%;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
`

const Count = styled.span`
	margin-right: 8px;
`
