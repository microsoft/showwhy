/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Icon } from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'
import type { Handler, Maybe } from '@showwhy/types'

export const SelectableCard: React.FC<{
	onClick: Handler
	title?: string
	isChecked?: Maybe<boolean>
	icon?: string
}> = memo(function CardComponent({ title, onClick, isChecked, icon }) {
	const handleOnClick = useOnClickHandler(isChecked, onClick)
	return (
		<Card
			checked={isChecked}
			onClick={handleOnClick}
			data-pw={isChecked ? 'selected-card' : 'card'}
		>
			{icon && <ButtonIcon iconName={icon}></ButtonIcon>}
			{title || null}
		</Card>
	)
})

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

function useOnClickHandler(isChecked: Maybe<boolean>, onClick: Handler) {
	return useCallback(() => !isChecked && onClick(), [isChecked, onClick])
}
