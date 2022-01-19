/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useState, useCallback, useMemo, memo, useEffect } from 'react'

import styled from 'styled-components'
import { ModelTable } from '../ModelTable'
import { ProjectFile } from '~interfaces'
import { replaceItemAtIndex } from '~utils'

interface SelectedTableDisplayProps {
	selectedFile?: ProjectFile
	originalTable: ColumnTable
	projectFiles: ProjectFile[]
	onSetSelectedFile: (file: ProjectFile) => void
	onSetProjectFiles: (files: ProjectFile[]) => void
}

export const SelectedTableDisplay: React.FC<SelectedTableDisplayProps> = memo(
	function SelectedTableDisplay({
		selectedFile,
		originalTable,
		projectFiles,
		onSetSelectedFile,
		onSetProjectFiles,
	}) {
		const [fileAlias, setFileAlias] = useState<string>(
			selectedFile?.alias || '',
		)

		const save = useCallback(() => {
			const file = {
				...selectedFile,
				alias: fileAlias,
			} as ProjectFile
			const index = projectFiles.findIndex(f => f.id === file.id)
			const files = replaceItemAtIndex(projectFiles, index, file)
			onSetSelectedFile(file)
			onSetProjectFiles(files)
		}, [
			fileAlias,
			selectedFile,
			projectFiles,
			onSetSelectedFile,
			onSetProjectFiles,
		])

		useEffect(() => {
			setFileAlias(selectedFile?.alias || '')
		}, [setFileAlias, selectedFile])

		const table: JSX.Element = useMemo(() => {
			return (
				originalTable && (
					<ModelTable
						sortable={true}
						columnsData={originalTable}
						columnNames={originalTable?.columnNames()}
					/>
				)
			)
		}, [originalTable])

		useEffect(() => {
			if (fileAlias && selectedFile?.alias !== fileAlias) {
				save()
			}
		}, [fileAlias, selectedFile, save])

		return (
			<Container>
				{selectedFile && originalTable ? (
					<SelectedFile>
						<TableDetails>
							<TableTitle>
								<TextField
									label="Name:"
									placeholder="Enter short name"
									underlined
									value={fileAlias}
									onChange={(e, value) => setFileAlias(value as string)}
								/>
							</TableTitle>
						</TableDetails>
						<DatasetContainer>{table}</DatasetContainer>
					</SelectedFile>
				) : (
					<NotSelectedContainer>
						<NotSelectedText>
							{projectFiles.length
								? 'Click on a dataset to view its content here'
								: null}
						</NotSelectedText>
					</NotSelectedContainer>
				)}
			</Container>
		)
	},
)

const NotSelectedContainer = styled.div`
	height: 400px;
	display: flex;
`

const NotSelectedText = styled.h3`
	width: 100%;
	text-align: center;
	margin: auto;
	color: ${({ theme }) => theme.application().midContrast};
	font-weight: normal;
`

const Container = styled.div`
	width: 100%;
`
const DatasetContainer = styled.div``

const TableDetails = styled.div`
	margin-bottom: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const TableTitle = styled.span`
	font-weight: bold;
	margin-right: 16px;
`
const SelectedFile = styled.div`
	background-color: white;
	padding: 8px;
`
