/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroTableHeader,
	ColumnTransformModal,
} from '@data-wrangling-components/react'
import {
	Dropdown,
	IconButton,
	IDetailsColumnProps,
	IDropdownOption,
	IRenderFunction,
	Separator,
} from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { FC, memo } from 'react'
import { If, Then, Else } from 'react-if'
import styled from 'styled-components'
import { Header } from './Header'
import { RenameCallout } from './RenameCallout'
import { StepsList } from './StepsList'
import { DialogConfirm } from '~components/DialogConfirm'
import { EmptyDataPageWarning } from '~components/EmptyDataPageWarning'
import { ModelVariableCommands } from '~components/ModelVariableCommands'
import { ArqueroDetailsTable } from '~components/Tables/ArqueroDetailsTable'
import {
	Pages,
	PageType,
	RenameCalloutType,
	TransformTable,
	RenameCalloutArgs,
	DefinitionArgs,
	DefinitionActions,
	SharedModelVariableLogic,
} from '~types'

interface ModelVariablesProps {
	pageType: PageType
	definitionArgs: DefinitionArgs
	transformTable: TransformTable
	table: ColumnTable
	definitionDropdown: IDropdownOption<any>[]
	commandBar: IRenderFunction<IDetailsColumnProps>
	renameCalloutArgs: RenameCalloutArgs
	definitionActions: DefinitionActions
	sharedLogic: SharedModelVariableLogic
}
export const ModelVariables: FC<ModelVariablesProps> = memo(
	function ModelVariables({
		pageType,
		definitionArgs,
		transformTable,
		table,
		definitionDropdown,
		commandBar,
		renameCalloutArgs,
		definitionActions,
		sharedLogic,
	}) {
		const { definition, onSelect } = definitionArgs
		const { showConfirmDelete, toggleShowConfirmDelete } = sharedLogic
		const { onDelete, onSaveCallout } = definitionActions
		const selectedId = definition?.id ?? ''

		const { toggleCallout, definitionName, calloutOpen } = renameCalloutArgs

		const {
			commands,
			isModalOpen,
			hideModal,
			originalTable,
			handleTransformRequested,
			variables,
		} = transformTable

		return (
			<>
				<DialogConfirm
					onConfirm={onDelete}
					show={showConfirmDelete}
					toggle={toggleShowConfirmDelete}
					title="Are you sure you want to delete?"
					subText="You will lose all the column transformations made in the table for this definition"
				/>
				<Header pageType={pageType} />
				{/* //fix this correctly */}
				<If condition={!definitionDropdown.length}>
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
											{calloutOpen && (
												<RenameCallout
													onSave={onSaveCallout}
													onDismiss={() => toggleCallout(undefined)}
													name={definitionName}
													targetId={calloutOpen}
												/>
											)}
											<Dropdown
												id={RenameCalloutType.Edit}
												selectedKey={selectedId}
												options={definitionDropdown}
												onChange={(_, value) => onSelect(value?.key as string)}
											/>
										</NameContainer>
										<IconButton
											id={RenameCalloutType.New}
											title="Create new definition"
											iconProps={{ iconName: 'Add' }}
											onClick={() => toggleCallout(RenameCalloutType.New)}
										></IconButton>
										<Separator vertical></Separator>
										<ModelVariableCommands
											selectedDefinition={selectedId}
											onCallout={toggleCallout}
											onDelete={toggleShowConfirmDelete}
										/>
									</VariablesContainer>

									{originalTable && (
										<ColumnTransformModal
											table={originalTable}
											isOpen={isModalOpen}
											onDismiss={hideModal}
											onTransformRequested={step =>
												handleTransformRequested(step, selectedId)
											}
										/>
									)}

									<StepsTitle>Definition steps</StepsTitle>
									<StepsList
										selectedDefinitionId={selectedId}
										variables={variables}
									/>
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
	},
)

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

const VariablesContainer = styled.div`
	display: flex;
`

const NameContainer = styled.div`
	flex: 1;
`
