/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useHandleOnUploadClick } from '@data-wrangling-components/react'
import { FileType } from '@data-wrangling-components/utilities'
import type { IContextualMenuItem } from '@fluentui/react'
import { useMemo } from 'react'
import { useHandleFiles } from '~hooks'

const UPLOAD_ZIP_BUTTON_ID = 'uploadZip'
const acceptedFileTypes = [`.${FileType.zip}`]

export function useUploadZipMenuOption(
	onError?: (msg: string) => void,
): IContextualMenuItem {
	const id = UPLOAD_ZIP_BUTTON_ID
	const handleFiles = useHandleFiles(onError)
	const handleClick = useHandleOnUploadClick(acceptedFileTypes, handleFiles)
	return useMemo(() => {
		return {
			'data-pw': id,
			key: id,
			text: 'Open project',
			iconProps: { iconName: 'Upload' },
			onClick: handleClick,
		}
	}, [id, handleClick])
}
