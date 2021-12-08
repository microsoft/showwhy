/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { SelectableCard } from '~components/CardComponent'
import { ProjectFile } from '~interfaces'

interface DatasetProps {
	file: ProjectFile
	selectedFile: ProjectFile
	onFileSelected: (file: ProjectFile) => void
}

export const Dataset: React.FC<DatasetProps> = memo(function Dataset({
	file,
	selectedFile,
	onFileSelected,
}) {
	return (
		<SelectableCard
			icon={file.loadedCorrectly ? 'CheckMark' : 'Important'}
			title={file.alias ?? file.name}
			isChecked={selectedFile?.name === file.name}
			onClick={() => onFileSelected(file)}
		/>
	)
})
