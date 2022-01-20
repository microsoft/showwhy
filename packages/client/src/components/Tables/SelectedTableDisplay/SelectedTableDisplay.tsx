/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroTableHeader } from '@data-wrangling-components/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { memo } from 'react'

import styled from 'styled-components'
import { ArqueroDetailsTable } from '../ArqueroDetailsTable'
import { ProjectFile } from '~interfaces'

interface SelectedTableDisplayProps {
	selectedFile?: ProjectFile
	originalTable: ColumnTable
	projectFiles: ProjectFile[]
	onRenameTable: (name: string) => void
}

export const SelectedTableDisplay: React.FC<SelectedTableDisplayProps> = memo(
	function SelectedTableDisplay({
		selectedFile,
		originalTable,
		projectFiles,
		onRenameTable,
	}) {
		return (
			<Container>
				{selectedFile && originalTable ? (
					<SelectedFile>
						<ArqueroTableHeader
							table={originalTable}
							name={selectedFile?.alias ?? selectedFile?.name}
							showRowCount
							showColumnCount
							onRenameTable={onRenameTable}
						/>
						<DatasetContainer>
							<ArqueroDetailsTable table={originalTable} />
						</DatasetContainer>
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
const DatasetContainer = styled.div`
	height: 50vh;
`

const SelectedFile = styled.div`
	background-color: white;
	padding: 8px;
`
