/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DialogConfirm } from '@essex/themed-components'
import {
	DefaultButton,
	Dropdown,
	IDropdownOption,
	MessageBarType,
	Toggle,
} from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import {
	DatasetsList,
	DropzoneContainer,
	MessageContainer,
} from '@showwhy/components'
import type { Maybe, ProjectFile } from '@showwhy/types'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { useAutomaticWorkflowStatus } from '~hooks'
import {
	useProjectFiles,
	useSelectedFile,
	useSetProjectFiles,
	useSetSelectedFile,
} from '~state'
import { ContainerFlexRow } from '~styles'
import { replaceItemAtIndex } from '~utils'

import { useAcceptedLoadFileTypes } from './hooks/useAcceptedLoadFileTypes'
import { useGlobalDropzone } from './hooks/useGlobalDropzone'
import { useHandleDelimiterChange } from './hooks/useHandleDelimiterChange'
import { useHandleLoadFile } from './hooks/useHandleLoadFile'
import { useOnConfirmDelete } from './hooks/useOnConfirmDelete'
import { useToggleAutoType } from './hooks/useToggleAutoType'
import { useToggleLoadedCorrectly } from './hooks/useToggleLoadedCorrectly'
import { delimiterOptions } from './LoadDataPage.types'
import { SelectedTableDisplay } from './SelectedTableDisplay'
import { SupportedFileTypes } from './SupportedFileTypes'

export const LoadDataPage: React.FC = memo(function LoadDataPage() {
	const acceptedFileTypes = useAcceptedLoadFileTypes()
	const [showConfirm, { toggle: toggleShowConfirm }] = useBoolean(false)
	const { setTodo, setDone } = useAutomaticWorkflowStatus()
	const selectedFile = useSelectedFile()
	const setSelectedFile = useSetSelectedFile()
	const projectFiles = useProjectFiles()
	const setProjectFiles = useSetProjectFiles()
	const [errorMessage, setErrorMessage] = useState<string | null>()
	const [selectedDelimiter, setSelectedDelimiter] = useState<Maybe<string>>(
		selectedFile?.delimiter,
	)

	const toggleLoadedCorrectly = useToggleLoadedCorrectly(
		selectedFile,
		projectFiles,
		setProjectFiles,
		setSelectedFile,
	)

	const toggleAutoType = useToggleAutoType(
		selectedFile,
		projectFiles,
		setProjectFiles,
		setSelectedFile,
	)

	const onConfirmDelete = useOnConfirmDelete(
		projectFiles,
		selectedFile,
		setProjectFiles,
		toggleShowConfirm,
		setSelectedFile,
		setTodo,
	)

	const updateProjectFiles = useCallback(
		(file: ProjectFile) => {
			const index = projectFiles.findIndex(f => f.id === file.id)
			const files = replaceItemAtIndex(projectFiles, index, file)
			setSelectedFile(file)
			setProjectFiles(files)
		},
		[projectFiles, setSelectedFile, setProjectFiles],
	)

	const handleDelimiterChange = useHandleDelimiterChange(
		selectedFile,
		setSelectedDelimiter,
		updateProjectFiles,
		toggleLoadedCorrectly,
	)

	const handleLoadFile = useHandleLoadFile(setErrorMessage, setDone)

	const {
		onDrop,
		onDropAccepted,
		onDropRejected,
		loading,
		fileCount,
		progress,
	} = useGlobalDropzone(setErrorMessage, handleLoadFile)

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
									checked={selectedFile?.loadedCorrectly || false}
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
