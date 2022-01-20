/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Icon } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'

interface SelectableCardProps {
	onClick: () => void
	title?: string
	isChecked?: boolean | undefined
	icon?: string
}

export const SelectableCard: React.FC<SelectableCardProps> = memo(
	function CardComponent({ title, onClick, isChecked, icon }) {
		return (
			<Card checked={isChecked} onClick={() => !isChecked && onClick()}>
				{icon && <ButtonIcon iconName={icon}></ButtonIcon>}
				{title || null}
			</Card>
		)
	},
)

const Card = styled(DefaultButton)`
	margin: 8px;
	display: flex;
	min-height: 32px;
	span {
		align-self: center;
	}
	border: 1px solid;
	${({ checked, theme }) =>
		checked ? theme.application().accent() : theme.application().foreground()};
`

const ButtonIcon = styled(Icon)`
	margin-right: 8px;
`
