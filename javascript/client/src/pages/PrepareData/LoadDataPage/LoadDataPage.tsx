/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, MessageBarType, Toggle } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { DatasetsList } from '~components/DatasetsList'
import { DelimiterDropdown } from '~components/DelimiterDropdown'
import { DialogConfirm } from '~components/DialogConfirm'
import { DropzoneContainer } from '~components/DropzoneContainer'
import { MessageContainer } from '~components/MessageContainer'
import { SelectedTableDisplay } from '~components/Tables/SelectedTableDisplay'
import { ContainerFlexRow } from '~styles'

import { useBusinessLogic } from './hooks'
import { SupportedFileTypes } from './SupportedFileTypes'

export const LoadDataPage: React.FC = memo(function LoadDataPage() {
	const {
		showConfirm,
		errorMessage,
		selectedFile,
		selectedDelimiter,
		projectFiles,
		onConfirmDelete,
		setSelectedFile,
		toggleShowConfirm,
		toggleLoadedCorrectly,
		toggleAutoType,
		handleDelimiterChange,
		handleDismissError,
		loading,
		fileCount,
		acceptedFileTypes,
		onDrop,
		onDropAccepted,
		onDropRejected,
		onRenameTable,
	} = useBusinessLogic()

	return (
		<Container>
			<DialogConfirm
				onConfirm={onConfirmDelete}
				show={showConfirm}
				toggle={toggleShowConfirm}
				title="Are you sure you want to delete this dataset?"
			/>
			{errorMessage ? (
				<MessageContainer
					type={MessageBarType.error}
					onDismiss={handleDismissError}
					styles={{ marginTop: '10px', padding: '4px' }}
				>
					{errorMessage}
				</MessageContainer>
			) : null}
			<ContainerFlexRow>
				<ContainerFileUpload>
					<SupportedFileTypes fileTypesAllowed={acceptedFileTypes} />
					<DropzoneContainer
						loading={loading}
						filesCount={fileCount}
						text={
							!!selectedFile
								? 'Upload dataset'
								: 'Drop or upload a .zip or .csv file'
						}
						hasSelectedFiles={!!selectedFile}
						onDrop={onDrop}
						onDropRejected={onDropRejected}
						onDropAccepted={onDropAccepted}
						acceptedFileTypes={acceptedFileTypes}
					/>
				</ContainerFileUpload>

				<DatasetsList
					onFileSelected={setSelectedFile}
					files={projectFiles}
					selectedFile={selectedFile}
				/>
			</ContainerFlexRow>

			{selectedFile ? (
				<>
					<TableContainer>
						<SelectedTableDisplay
							selectedFile={selectedFile}
							projectFiles={projectFiles}
							onRenameTable={onRenameTable}
						/>
					</TableContainer>
					<DataLoadIndicator>
						<ToggleWrapper>
							<FlexContainer>
								<Toggle
									label="Data loaded correctly"
									onText="Yes"
									checked={selectedFile?.loadedCorrectly || false}
									offText="No"
									onChange={() => toggleLoadedCorrectly()}
								/>
								{!selectedFile.loadedCorrectly ? (
									<DelimiterDropdown
										selectedKey={selectedDelimiter}
										onChange={handleDelimiterChange}
										styles={{ root: { width: '9em' } }}
									/>
								) : null}
							</FlexContainer>
							<Toggle
								label="Auto Type"
								onText="On"
								checked={!!selectedFile?.autoType}
								offText="Off"
								onChange={() => toggleAutoType(!selectedFile?.autoType)}
							/>
						</ToggleWrapper>
						<DeleteButton
							title="Delete current dataset"
							onClick={() => toggleShowConfirm()}
						>
							Delete dataset
						</DeleteButton>
					</DataLoadIndicator>
				</>
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
	margin-top: 0.5rem;
	height: 30px;
`

const FlexContainer = styled.div`
	display: flex;
	width: 18rem;
	justify-content: space-between;
`

const ToggleWrapper = styled.div``
