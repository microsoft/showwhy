/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'
import {
	ArqueroTableHeader,
	ColumnTransformModal,
} from '@data-wrangling-components/react'
import { Dropdown, IconButton, Separator } from '@fluentui/react'
import { memo } from 'react'
import { If, Then, Else } from 'react-if'
import styled from 'styled-components'
import { Header } from '../Header'
import { StepComponent } from '../StepComponent'
import {
	useCommandBar,
	useDefinitionDropdown,
	useTable,
	useTableTransform,
} from '../hooks'
import { RenameCallout } from './RenameCallout'
import { useDefinitions, useBusinessLogic, useSetTargetVariable } from './hooks'
import { EmptyDataPageWarning } from '~components/EmptyDataPageWarning'
import { EmptyVariableSteps } from '~components/EmptyVariableSteps'
import { ModelVariableCommands } from '~components/ModelVariableCommands'
import { ArqueroDetailsTable } from '~components/Tables/ArqueroDetailsTable'
import { Pages } from '~types'

export const GeneralPage: React.FC = memo(function GeneralPage() {
	const { pageType, defineQuestionData, definitions } = useBusinessLogic()
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
		saveDefinition,
	} = useDefinitions(defineQuestionData)

	const definitionDropdown = useDefinitionDropdown(definitions)

	const {
		commands,
		isModalOpen,
		hideModal,
		originalTable,
		handleTransformRequested,
		variables,
	} = useTableTransform(selectedDefinitionId)
	const table = useTable(selectedDefinitionId, variables, originalTable)
	const setTargetVariable = useSetTargetVariable(
		selectedDefinitionId,
		saveDefinition,
		defineQuestionData,
	)

	const commandBar = useCommandBar(
		definitions,
		selectedDefinitionId,
		setTargetVariable,
	)

	return (
		//What if no visible columns?
		//What if no define question?
		<>
			<Header pageType={pageType} />
			<If condition={!defineQuestionData && !definitionDropdown.length}>
				<Then>
					<EmptyDataPageWarning
						text="Please load a dataset to get started: "
						linkText="Load Datasets"
						page={Pages.LoadData}
					/>
				</Then>
				<Else>
					<Then>
						<Container>
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
										<EmptyVariableSteps />
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
		</>
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
