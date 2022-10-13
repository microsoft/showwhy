/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { memo, useCallback } from 'react'
import { useResetRecoilState } from 'recoil'

import { PersistedInfoState } from '../../state/index.js'
import type { ClearStateButtonProps } from './ClearStateButton.types.js'

export const ClearStateButton: React.FC<ClearStateButtonProps> = memo(
	function ClearStateButton({ label, onClick }) {
		const resetPersistedInfo = useResetRecoilState(PersistedInfoState)

		const onClickHandler = useCallback(() => {
			onClick?.()
			resetPersistedInfo()
		}, [onClick, resetPersistedInfo])

		return <DefaultButton onClick={onClickHandler}>{label}</DefaultButton>
	},
)
