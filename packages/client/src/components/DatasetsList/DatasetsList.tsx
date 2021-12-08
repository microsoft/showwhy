/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { Dataset } from './Dataset'
import { ProjectFile } from '~interfaces'
import { ContainerFlexRow } from '~styles'

export interface DatasetsListProps {
	onFileSelected: (projectFile: ProjectFile) => void
	files: ProjectFile[]
	selectedFile: ProjectFile
	title?: string
}

export const DatasetsList: React.FC<DatasetsListProps> = memo(
	function DatasetsList({ onFileSelected, title, files, selectedFile }) {
		return (
			<ContainerFlexRow>
				<Title>{title}</Title>
				{files.length ? (
					<ListContainer>
						{files.map(file => (
							<Dataset
								key={file.name}
								file={file}
								onFileSelected={onFileSelected}
								selectedFile={selectedFile}
							/>
						))}
					</ListContainer>
				) : (
					<TitleTableEmptyContainer>
						<TitleTableEmptyText>Load a dataset to start</TitleTableEmptyText>
					</TitleTableEmptyContainer>
				)}
			</ContainerFlexRow>
		)
	},
)

const ListContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
`

const TitleTableEmptyContainer = styled.div`
	color: ${({ theme }) => theme.application().midContrast};
	margin-left: 16px;
	display: flex;
`
const TitleTableEmptyText = styled.span`
	vertical-align: bottom;
	margin: auto;
`

const Title = styled.h3`
	margin: unset;
	align-self: center;
`
