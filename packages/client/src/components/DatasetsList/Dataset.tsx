/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useCallback } from 'react'
import { SelectableCard } from '~components/CardComponent'
import { Handler1, ProjectFile, Maybe } from '~types'

export const Dataset: React.FC<{
	file: ProjectFile
	selectedFile: Maybe<ProjectFile>
	onFileSelected: (file: ProjectFile) => void
}> = memo(function Dataset({ file, selectedFile, onFileSelected }) {
	const handleOnClick = useOnClickHandler(file, onFileSelected)
	return (
		<SelectableCard
			icon={file.loadedCorrectly ? 'CheckMark' : 'Important'}
			title={file.alias ?? file.name}
			isChecked={selectedFile?.name === file.name}
			onClick={handleOnClick}
		/>
	)
})

function useOnClickHandler(
	file: ProjectFile,
	onFileSelected: Handler1<ProjectFile>,
) {
	return useCallback(() => onFileSelected(file), [file, onFileSelected])
}
