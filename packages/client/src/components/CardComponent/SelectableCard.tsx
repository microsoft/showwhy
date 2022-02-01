/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Icon } from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { Handler0 } from '~types'

export const SelectableCard: React.FC<{
	onClick: () => void
	title?: string
	isChecked?: boolean | undefined
	icon?: string
}> = memo(function CardComponent({ title, onClick, isChecked, icon }) {
	const handleOnClick = useOnClickHandler(isChecked, onClick)
	return (
		<Card checked={isChecked} onClick={handleOnClick}>
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

function useOnClickHandler(isChecked: boolean | undefined, onClick: Handler0) {
	return useCallback(() => !isChecked && onClick(), [isChecked, onClick])
}
