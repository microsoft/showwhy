/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useHandleFilesUpload } from '@data-wrangling-components/react'
import { FileType } from '@data-wrangling-components/utilities'
import type { IContextualMenuItem } from '@fluentui/react'
import { useMemo } from 'react'

import { useHandleFiles } from '~hooks'

const id = 'uploadZip'

export function useUploadZipMenuOption(
	onError: (msg: string) => void,
): IContextualMenuItem {
	const handleFiles = useHandleFiles(onError)
	const handleClick = useHandleFilesUpload([`.${FileType.zip}`], handleFiles)
	return useMemo(() => {
		return {
			'data-pw': id,
			key: id,
			text: 'Open project',
			iconProps: { iconName: 'Upload' },
			onClick: handleClick,
		}
	}, [handleClick])
}
