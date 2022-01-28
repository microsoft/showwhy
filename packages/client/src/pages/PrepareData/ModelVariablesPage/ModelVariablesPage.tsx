/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroTableHeader } from '@data-wrangling-components/react'
import { memo } from 'react'
import { If, Then, Else } from 'react-if'
import styled from 'styled-components'
import { DefinitionList } from './DefinitionList/DefinitionList'
import { DefinitionSteps } from './DefinitionSteps'
import { Header } from './Header'
import { useBusinessLogic } from './hooks'
import { EmptyDataPageWarning } from '~components/EmptyDataPageWarning'
import { ArqueroDetailsTable } from '~components/Tables/ArqueroDetailsTable'
import { ContainerFlexRow } from '~styles'
import { Pages, CausalFactor } from '~types'
import { Dropdown, IconButton } from '@fluentui/react'
import { FileExtensions } from '@data-wrangling-components/utilities'

export const ModelVariablesPage: React.FC = memo(function ModelVariablesPage() {
	const {
		pageType,
		definitionSelected,
		defineQuestionData,
		modelVariables,
		subjectIdentifierData,
		tableIdentifier,
		definitionOptions,
		definitionDropdown,
		onSave,
		onEditClause,
		onSelectDefinition,
		commandBar,
	} = useBusinessLogic()

	return (
		//What if no visible columns?
		<If condition={!defineQuestionData && modelVariables.length === 0}>
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
							{/* List of definitions for the user to choose */}
							{/* list of definitions: definitionOptions */}
							{/* selectedDefinition={definitionSelected} */}
							{/* See step definitions (need to have new config) */}
							{/* with options: */}
							{/* see table */}
							<Dropdown options={definitionDropdown} />
							{console.log(subjectIdentifierData)}
							<span>Definition steps</span>
							<List>
								<CommandCard>
									<CommandCardTitle>new column name</CommandCardTitle>
									<CommandCardDetails>transform</CommandCardDetails>
									<CommandCardDetails>column binding</CommandCardDetails>
									<CommandCardDetails>=</CommandCardDetails>
									<CommandCardDetails>value</CommandCardDetails>
									<Buttons>
										<IconButton
											iconProps={{ iconName: 'Edit' }}
											title="Edit"
											ariaLabel="Edit Emoji"
										/>
										<IconButton
											iconProps={{ iconName: 'Delete' }}
											title="Delete"
											ariaLabel="Delete Emoji"
										/>
									</Buttons>
								</CommandCard>
								<CommandCard>
									<CommandCardTitle>new column name</CommandCardTitle>
									<CommandCardDetails>transform</CommandCardDetails>
									<CommandCardDetails>column binding</CommandCardDetails>
									<CommandCardDetails>=</CommandCardDetails>
									<CommandCardDetails>value</CommandCardDetails>
									<Buttons>
										<IconButton
											iconProps={{ iconName: 'Edit' }}
											title="Edit"
											ariaLabel="Edit Emoji"
										/>
										<IconButton
											iconProps={{ iconName: 'Delete' }}
											title="Delete"
											ariaLabel="Delete Emoji"
										/>
									</Buttons>
								</CommandCard>
							</List>
							{/* user will derive columns and then we'll show  (arquero select)*/}
							{subjectIdentifierData.table && (
								<>
									<ArqueroTableHeader table={subjectIdentifierData.table} />
									<DetailsListContainer>
										<ArqueroDetailsTable
											table={subjectIdentifierData.table}
											columns={(subjectIdentifierData.columnNames || []).map(
												n => ({
													name: n,
													key: n,
													fieldName: n,
													minWidth: 170,
												}),
											)}
											features={{
												smartHeaders: true,
												commandBar: [commandBar],
											}}
										/>
									</DetailsListContainer>
								</>
							)}

							{/* {!tableIdentifier ? null : (
								<ContainerFlexRow>
									<DefinitionListContainer>
										<TitleContainer>
											<DefinitionTitle>Definitions</DefinitionTitle>
										</TitleContainer>
										<DefinitionList
											onUpdate={onSave}
											tableId={tableIdentifier.tableId}
											onClick={onSelectDefinition}
											list={definitionOptions as CausalFactor[]}
											selectedDefinition={selected}
											type={pageType}
										/>
									</DefinitionListContainer>
									<StepsContainer>
										<TitleContainer>
											<DefinitionTitle>Definition steps</DefinitionTitle>
										</TitleContainer>
										<DefinitionSteps
											onEdit={onEditClause}
											fileId={tableIdentifier.tableId}
											type={pageType}
											selectedDefinition={selected}
										/>
									</StepsContainer>
								</ContainerFlexRow>
							)} */}
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

const DefinitionListContainer = styled.div`
	width: 45%;
`
const StepsContainer = styled.div`
	width: 55%;
`

const DefinitionTitle = styled.h4`
	margin: unset;
`

const NormalContainer = styled.div``

const TitleContainer = styled.div`
	margin: 8px 0px;
	display: flex;
	justify-content: space-between;
	width: 100%;
`

const DetailsListContainer = styled.div`
	height: 60vh;
`

const CommandCard = styled.div`
	text-align: center;
	padding: 2px 6px 6px 6px;
	/* background-color: rgb(241, 241, 241); */
	margin: 8px 8px 8px 0px;
	display: flex;
	flex-direction: column;
	box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
	border: 1px solid #c5c5c5;
`

const CommandCardTitle = styled.h3`
	text-align: center;
	margin: unset;
	color: ${({ theme }) => theme.application().accent().hex()};
`
const CommandCardDetails = styled.span``

const List = styled.div`
	display: flex;
`

const Buttons = styled.div`
	display: flex;
	justify-content: space-evenly;
`
