/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuProps, IIconProps } from '@fluentui/react'
import { CommandButton } from '@fluentui/react'
import type { Handler1 } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

export const OptionsButton: React.FC<{
	menuProps?: IContextualMenuProps
	text?: string
	iconProps?: IIconProps
	onClick?: Handler1
}> = memo(function OptionsButton({ menuProps, text, iconProps, onClick }) {
	return (
		<Options
			primary
			iconProps={iconProps}
			text={text}
			onClick={onClick}
			menuProps={menuProps}
		/>
	)
})

const Options = styled(CommandButton)`
	color: white;
	margin-right: 8px;

	i {
		color: white !important;
	}

	&:hover {
		color: white;
		background-color: rgb(57, 105, 172);
		i {
			color: white;
		}
	}
`
