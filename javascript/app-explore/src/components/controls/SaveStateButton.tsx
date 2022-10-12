/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilValue } from 'recoil'

import { PersistedInfoState } from '../../state/index.js'
import { saveObjectJSON } from '../../utils/Save.js'
import type { SaveStateButtonProps } from './SaveStateButton.types.js'

export const SaveStateButton: React.FC<SaveStateButtonProps> = memo(
	function SaveStateButton({ label, filename = 'causal-model', error }) {
		const persistedInfo = useRecoilValue(PersistedInfoState)

		return (
			<DefaultButton
				onClick={() => saveObjectJSON(filename, persistedInfo, error)}
			>
				{label}
			</DefaultButton>
		)
	},
)
