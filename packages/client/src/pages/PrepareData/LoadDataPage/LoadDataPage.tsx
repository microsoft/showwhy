/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Icon, Toggle } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { SupportedFileTypes } from './SupportedFileTypes'
import { useBusinessLogic } from './hooks'
import { DatasetsList } from '~components/DatasetsList'
import { DialogConfirm } from '~components/DialogConfirm'
import { DropzoneContainer } from '~components/DropzoneContainer'
import { MessageContainer } from '~components/MessageContainer'
import { SelectedTableDisplay } from '~components/Tables/SelectedTableDisplay'
import { DelimiterDropdown } from '~components/controls'
import { ContainerFlexRow } from '~styles'

export const LoadDataPage: React.FC = memo(function LoadDataPage() {
	const {
		showConfirm,
		errorMessage,
		selectedFile,
		selectedDelimiter,
		projectFiles,
		originalTable,
		setProjectFiles,
		onConfirmDelete,
		setSelectedFile,
		toggleShowConfirm,
		toggleLoadedCorrectly,
		handleDelimiterChange,
		loading,
		filesCount,
		getRootProps,
		getInputProps,
		isDragActive,
	} = useBusinessLogic()

	return (
		<Container>
			<DialogConfirm
				onConfirm={onConfirmDelete}
				show={showConfirm}
				toggle={toggleShowConfirm}
				title="Are you sure you want to delete this dataset?"
			/>
			<ContainerFlexRow>
				<ContainerFileUpload>
					<SupportedFileTypes />
					<DropzoneContainer
						loading={loading}
						filesCount={filesCount}
						getRootProps={getRootProps}
						getInputProps={getInputProps}
						isDragActive={isDragActive}
					/>
				</ContainerFileUpload>

				<DatasetsList
					onFileSelected={setSelectedFile}
					files={projectFiles}
					selectedFile={selectedFile}
				/>
			</ContainerFlexRow>

			{errorMessage ? (
				<MessageContainer type="error">
					<ErrorIcon iconName="error" />
					{errorMessage}
				</MessageContainer>
			) : null}

			<TableContainer>
				<SelectedTableDisplay
					selectedFile={selectedFile}
					onSetSelectedFile={setSelectedFile}
					projectFiles={projectFiles}
					onSetProjectFiles={setProjectFiles}
					originalTable={originalTable}
				/>
			</TableContainer>

			{selectedFile ? (
				<DataLoadIndicator>
					<FlexContainer>
						<Toggle
							label="Data loaded correctly"
							onText="Yes"
							checked={selectedFile?.loadedCorrectly || false}
							offText="No"
							onChange={toggleLoadedCorrectly}
						/>
						{!selectedFile.loadedCorrectly ? (
							<DelimiterDropdown
								selectedKey={selectedDelimiter}
								onChange={handleDelimiterChange}
								styles={{ root: { width: '9em' } }}
							/>
						) : null}
					</FlexContainer>
					<DeleteButton
						title="Delete current dataset"
						onClick={() => toggleShowConfirm()}
					>
						Delete dataset
					</DeleteButton>
				</DataLoadIndicator>
			) : null}
		</Container>
	)
})

const DeleteButton = styled(DefaultButton)`
	align-self: center;
`

const Container = styled.div`
	flex: 1;
	height: 100%;
`

const TableContainer = styled.div`
	margin-top: 16px;
`

const DataLoadIndicator = styled.div`
	display: flex;
	margin-top: 16px;
	justify-content: space-between;
`

const ContainerFileUpload = styled.div`
	display: flex;
	align-items: center;
`

const ErrorIcon = styled(Icon)`
	margin-right: 8px;
	vertical-align: bottom;
`
const FlexContainer = styled.div`
	display: flex;
	width: 18rem;
	justify-content: space-between;
`
