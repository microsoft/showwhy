/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler, Maybe } from '@showwhy/types'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import type { ProjectFile } from '~types'

export function useOnConfirmDelete(
	projectFiles: ProjectFile[],
	selectedFile: Maybe<ProjectFile>,
	setProjectFiles: SetterOrUpdater<ProjectFile[]>,
	toggleShowConfirm: (value?: boolean) => void,
	setSelectedFile: SetterOrUpdater<Maybe<ProjectFile>>,
	onDelete: Handler,
): Handler {
	return useCallback(() => {
		const filteredFiles = projectFiles.filter(p => p.id !== selectedFile?.id)
		setProjectFiles(filteredFiles)
		setSelectedFile(undefined)
		filteredFiles.length === 0 && onDelete()
		toggleShowConfirm()
	}, [
		projectFiles,
		selectedFile,
		setProjectFiles,
		toggleShowConfirm,
		setSelectedFile,
		onDelete,
	])
}
