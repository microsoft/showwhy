/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CommandButton, IContextualMenuProps } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'

interface OptionsButtonProps {
	menuProps: IContextualMenuProps
	text: string
}

export const OptionsButton: React.FC<OptionsButtonProps> = memo(
	function OptionsButton({ menuProps, text }) {
		return <Options primary text={text} menuProps={menuProps} />
	},
)

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
