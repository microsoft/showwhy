/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DialogConfirm } from '@essex/themed-components'
import {
	DefaultButton,
	Dropdown,
	MessageBarType,
	Toggle,
} from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import {
	ContainerFlexRow,
	DropzoneContainer,
	MessageContainer,
} from '@showwhy/components'
import type { Maybe } from '@showwhy/types'
import { memo, useEffect, useState } from 'react'
import styled from 'styled-components'

import { useAutomaticWorkflowStatus } from '~hooks'

import { DatasetsList } from './components/DatasetsList'
import { SelectedTableDisplay } from './components/SelectedTableDisplay'
import { SupportedFileTypes } from './components/SupportedFileTypes'
import { useDropzone } from './hooks/useDropzone'
import { useFileManagement } from './hooks/useFileManagement'
import { useHandleDelimiterChange } from './hooks/useHandleDelimiterChange'
import { useOnConfirmDelete } from './hooks/useOnConfirmDelete'
import { useToggleAutoType } from './hooks/useToggleAutoType'
import { useToggleLoadedCorrectly } from './hooks/useToggleLoadedCorrectly'
import { delimiterOptions } from './LoadDataPage.constants'

export const LoadDataPage: React.FC = memo(function LoadDataPage() {
	const [showConfirm, { toggle: toggleShowConfirm }] = useBoolean(false)
	const { setTodo, setDone } = useAutomaticWorkflowStatus()
	const [errorMessage, setErrorMessage] = useState<string | null>()
	const {
		doRemoveFile,
		doUpdateFiles,
		projectFiles,
		selectedFile,
		setSelectedFile,
		onFileLoad,
		onZipFileLoad,
		acceptedFileTypes,
	} = useFileManagement(setErrorMessage)

	useEffect(() => {
		!!projectFiles.length ? setDone() : setTodo()
	}, [projectFiles, setDone, setTodo])

	const [selectedDelimiter, setSelectedDelimiter] = useState<Maybe<string>>(
		selectedFile?.delimiter,
	)

	const toggleLoadedCorrectly = useToggleLoadedCorrectly(
		doUpdateFiles,
		selectedFile,
	)

	const toggleAutoType = useToggleAutoType(doUpdateFiles, selectedFile)

	const onConfirmDelete = useOnConfirmDelete(doRemoveFile, toggleShowConfirm)

	const handleDelimiterChange = useHandleDelimiterChange(
		setSelectedDelimiter,
		selectedFile,
		doUpdateFiles,
		toggleLoadedCorrectly,
	)

	const {
		onDrop,
		onDropAccepted,
		onDropRejected,
		loading,
		fileCount,
		progress,
	} = useDropzone(setErrorMessage, onFileLoad, onZipFileLoad)

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
					onDismiss={() => setErrorMessage('')}
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
						progress={progress}
						filesCount={fileCount}
						text={
							!!selectedFile
								? 'Upload data file'
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
						/>
					</TableContainer>
					<DataLoadIndicator>
						<ToggleWrapper>
							<FlexContainer>
								<Toggle
									label="Data loaded correctly"
									onText="Yes"
									checked={!!selectedFile?.loadedCorrectly}
									offText="No"
									onChange={() => toggleLoadedCorrectly()}
								/>
								{!selectedFile.loadedCorrectly ? (
									<Dropdown
										options={delimiterOptions}
										label="delimiter"
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
							onClick={toggleShowConfirm}
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
