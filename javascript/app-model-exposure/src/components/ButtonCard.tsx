/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useCallback } from 'react'

import type { Handler, Maybe } from '../types/primitives.js'
import { Button, ButtonIcon } from './ButtonCard.styles.js'

export const ButtonCard: React.FC<{
	onClick: Handler
	title?: string
	isChecked?: Maybe<boolean>
	icon?: string
}> = memo(function ButtonCard({ title, onClick, isChecked = false, icon }) {
	const handleOnClick = useOnClickHandler(isChecked, onClick)
	return (
		<Button
			checked={isChecked}
			onClick={handleOnClick}
			data-pw={isChecked ? 'selected-card' : 'card'}
		>
			{icon && <ButtonIcon iconName={icon}></ButtonIcon>}
			{title || null}
		</Button>
	)
})

function useOnClickHandler(isChecked: Maybe<boolean>, onClick: Handler) {
	return useCallback(() => !isChecked && onClick(), [isChecked, onClick])
}
