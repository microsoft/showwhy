/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { memo, useCallback, useRef } from 'react'
import { useSetRecoilState } from 'recoil'

import { PersistedInfoState } from '../../state/PersistentInfoState.js'
import type { LoadStateButtonProps } from './LoadStateButton.types.js'

export const LoadStateButton: React.FC<LoadStateButtonProps> = memo(
	function LoadStateButtonProps({ label }) {
		const setPersistedInfo = useSetRecoilState(PersistedInfoState)
		const fileInputRef = useRef<HTMLInputElement | null>(null)
		const openFilePicker = useCallback(
			() => fileInputRef.current?.click(),
			[fileInputRef],
		)

		const handleChangeFile = (file: Blob) => {
			const fileData = new FileReader()
			fileData.onloadend = e => {
				const content = JSON.parse(e?.target?.result as string)
				setPersistedInfo(content)
			}

			fileData.readAsText(file)
		}

		return (
			<>
				<DefaultButton content={label} onClick={openFilePicker}>
					{label}
				</DefaultButton>
				<input
					hidden
					ref={fileInputRef}
					type="file"
					accept=".json"
					onChange={e => {
						if (e.target.files === null) {
							return
						}

						handleChangeFile(e.target.files[0])
						e.currentTarget.value = ''
					}}
				/>
			</>
		)
	},
)
