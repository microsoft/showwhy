/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ButtonCard } from '@showwhy/components'
import type { Maybe, ProjectFile } from '@showwhy/types'
import { memo, useCallback } from 'react'

export const Dataset: React.FC<{
	file: ProjectFile
	selectedFile: Maybe<ProjectFile>
	onFileSelected: (file: ProjectFile) => void
}> = memo(function Dataset({ file, selectedFile, onFileSelected }) {
	const handleOnClick = useCallback(
		() => onFileSelected(file),
		[file, onFileSelected],
	)
	return (
		<ButtonCard
			icon={file.loadedCorrectly ? 'CheckMark' : 'Important'}
			title={file.alias ?? file.name}
			isChecked={selectedFile?.name === file.name}
			onClick={handleOnClick}
		/>
	)
})
