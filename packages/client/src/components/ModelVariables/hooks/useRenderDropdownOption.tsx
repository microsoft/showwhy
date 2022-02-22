/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Icon, IRenderFunction, ISelectableOption } from '@fluentui/react'
import { useCallback } from 'react'
import styled from 'styled-components'
import { Text } from '~styles'

export function useRenderDropdownOption():
	| IRenderFunction<ISelectableOption<any>>
	| undefined {
	return useCallback((props?, defaultRender?) => {
		if (!props || !defaultRender) {
			return null
		}
		return (
			<Option>
				{props.data && props.data.icon && (
					<OptionIcon
						style={{ fontSize: '24px' }}
						iconName={props.data.icon}
						aria-hidden="true"
						title="Column assigned"
					/>
				)}
				<Text>{props.text}</Text>
			</Option>
		)
	}, [])
}

const Option = styled.div`
	width: 100%;
	display: flex;
	column-gap: 8px;
	overflow: visible;
	white-space: normal;
`

const OptionIcon = styled(Icon)`
	color: ${({ theme }) => theme.application().success().hex()};
`
