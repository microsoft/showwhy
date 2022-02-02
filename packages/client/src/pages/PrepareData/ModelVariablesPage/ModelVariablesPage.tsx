/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import {
	ArqueroTableHeader,
	ColumnTransformModal,
} from '@data-wrangling-components/react'
import {
	ActionButton,
	Dropdown,
	IconButton,
	Separator,
	TextField,
} from '@fluentui/react'
import { memo } from 'react'
import { If, Then, Else } from 'react-if'
import styled from 'styled-components'
import { EmptySteps } from './EmptySteps'
import { Header } from './Header'
import { ModelVariableCommands } from './ModelVariableCommands'
import { RenameCallout } from './RenameCallout'
import { StepComponent } from './StepComponent'
import {
	useTableTransform,
	useCommandBar,
	useTable,
	useDefinitions,
	useDefinitionDropdown,
	useBusinessLogic,
} from './hooks'
import { EmptyDataPageWarning } from '~components/EmptyDataPageWarning'
import { ArqueroDetailsTable } from '~components/Tables/ArqueroDetailsTable'
import { Pages } from '~types'

export const ModelVariablesPage: React.FC = memo(function ModelVariablesPage() {
	const { pageType, defineQuestionData, causalFactors, definitionOptions } =
		useBusinessLogic()

	const {
		selectedDefinitionId,
		setSelectedDefinitionId,
		isEditingDefinition,
		isDuplicatingDefinition,
		toggleEditDefinition,
		onChange,
		definitionName,
		onSave,
		toggleAddDefinition,
		isAddingDefinition,
		onDelete,
		toggleDuplicateDefinition,
	} = useDefinitions(defineQuestionData, causalFactors)

	const definitionDropdown = useDefinitionDropdown(definitionOptions)

	const {
		commands,
		isModalOpen,
		hideModal,
		originalTable,
		handleTransformRequested,
		variables,
	} = useTableTransform(selectedDefinitionId)
	const table = useTable(selectedDefinitionId, variables, originalTable)

	const commandBar = useCommandBar(
		definitionOptions,
		selectedDefinitionId,
		causalFactors,
		pageType,
		defineQuestionData,
	)

	return (
		//What if no visible columns?
		//What if no define question?
		<If condition={!defineQuestionData && !definitionDropdown.length}>
			<Then>
				<Header />
				<EmptyDataPageWarning
					text="Please load a dataset to get started: "
					linkText="Load Datasets"
					page={Pages.LoadData}
				/>
			</Then>
			<Else>
				<Then>
					<Container>
						<Header />
						<NormalContainer>
							<VariablesContainer>
								<NameContainer>
									{(isEditingDefinition ||
										isAddingDefinition ||
										isDuplicatingDefinition) && (
										<RenameCallout
											onSend={onSave}
											editedName={definitionName}
											onChange={onChange}
											targetId={
												isEditingDefinition
													? 'dropdownDefinition'
													: isDuplicatingDefinition
													? 'duplicateDefinition'
													: 'newDefinition'
											}
										/>
									)}
									<Dropdown
										id="dropdownDefinition"
										selectedKey={selectedDefinitionId}
										options={definitionDropdown}
										onChange={(_, value) =>
											setSelectedDefinitionId(value?.key as string)
										}
									/>
								</NameContainer>
								<IconButton
									id="newDefinition"
									title="Create new definition"
									iconProps={{ iconName: 'Add' }}
									onClick={toggleAddDefinition}
								></IconButton>
								<Separator vertical></Separator>
								<ModelVariableCommands
									selectedDefinition={selectedDefinitionId}
									onEdit={toggleEditDefinition}
									onDelete={onDelete}
									onDuplicate={toggleDuplicateDefinition}
								/>
							</VariablesContainer>

							{originalTable && (
								<ColumnTransformModal
									table={originalTable}
									isOpen={isModalOpen}
									onDismiss={hideModal}
									onTransformRequested={step =>
										handleTransformRequested(step, selectedDefinitionId)
									}
								/>
							)}

							<StepsTitle>Definition steps</StepsTitle>
							<List>
								{!variables.find(x => x.id === selectedDefinitionId) && (
									<EmptySteps />
								)}
								{variables
									.find(x => x.id === selectedDefinitionId)
									?.steps.map((step: Step, index: number) => {
										return <StepComponent key={index} step={step} />
									})}
							</List>
							{table && (
								<>
									<ArqueroTableHeader table={table} commands={commands} />
									<DetailsListContainer>
										<ArqueroDetailsTable
											table={table}
											columns={(table.columnNames() || []).map(n => ({
												name: n,
												key: n,
												fieldName: n,
												minWidth: 170,
											}))}
											features={{
												smartHeaders: true,
												commandBar: [commandBar],
											}}
										/>
									</DetailsListContainer>
								</>
							)}
						</NormalContainer>
					</Container>
				</Then>
			</Else>
		</If>
	)
})

const Container = styled.div`
	height: 100%;
`

const StepsTitle = styled.h4`
	margin-bottom: unset;
`

const NormalContainer = styled.div``

const DetailsListContainer = styled.div`
	height: 60vh;
`

const List = styled.div`
	display: flex;
`

const VariablesContainer = styled.div`
	display: flex;
`

const NameContainer = styled.div`
	flex: 1;
`
