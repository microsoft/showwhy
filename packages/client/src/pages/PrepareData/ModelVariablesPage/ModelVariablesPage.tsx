/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
} from '@data-wrangling-components/react'
import {
	ContextualMenu,
	DefaultButton,
	IContextualMenuProps,
} from '@fluentui/react'
import React, { memo } from 'react'
import { If, Then, Else } from 'react-if'
import styled from 'styled-components'
import { DeriveComponent } from '../../../pages/PrepareData/ModelVariablesPage/DeriveComponent/DeriveComponent'
import { DefinitionList } from './DefinitionList/DefinitionList'
import { DefinitionSteps } from './DefinitionSteps'
import { Header } from './Header'
import { useBusinessLogic } from './hooks'
import { EmptyDataPageWarning } from '~components/EmptyDataPageWarning'
import { PageType, Pages } from '~enums'
import { ContainerFlexRow } from '~styles'
import ColumnTable from 'arquero/dist/types/table/column-table'

export const ModelVariablesPage: React.FC = memo(function ModelVariablesPage() {
	const {
		pageType,
		selected,
		columnsMenuProps,
		defineQuestionData,
		modelVariables,
		subjectIdentifier,
		subjectIdentifierData,
		tableIdentifier,
		definitionOptions,
		isDeriveVisible,
		editingClause,
		onResetClause,
		onSave,
		onToggleDeriveVisible,
		onEditClause,
		onUpdateTargetVariable,
		onSelectDefinition,
	} = useBusinessLogic()

	return (
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
				<If
					condition={
						!subjectIdentifier.length || !subjectIdentifierData.columns
					}
				>
					<Then>
						<Header />
						<EmptyDataPageWarning
							text="Please specify data columns to continue: "
							linkText="Prepare Data"
							page={Pages.ProcessTableColumns}
						/>
					</Then>
					<Else>
						{console.log('column names', subjectIdentifierData.columnNames)}
						<Container>
							<Header />
							<NormalContainer>
								<ArqueroTableHeader
									table={subjectIdentifierData.columns}
									showRowCount
									showColumnCount
								/>
								<DetailsListContainer>
									<ArqueroDetailsList
										table={subjectIdentifierData.columns}
										visibleColumns={
											subjectIdentifierData.columnNames
												? [...subjectIdentifierData.columnNames]
												: []
										}
										includeAllColumns={false}
										isSortable
										isHeadersFixed
										isStriped
										showColumnBorders
									/>
								</DetailsListContainer>
								<ContainerFlexRow>
									<DefinitionListContainer>
										<TitleContainer>
											<DefinitionTitle>Definitions</DefinitionTitle>
										</TitleContainer>
										<DefinitionList
											onUpdate={onSave}
											tableId={tableIdentifier?.tableId}
											onClick={onSelectDefinition}
											list={definitionOptions}
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
											fileId={tableIdentifier?.tableId}
											type={pageType}
											selectedDefinition={selected}
										/>
										<NormalContainer>
											{isDeriveVisible ? (
												<DeriveComponent
													onReset={onResetClause}
													editing={editingClause}
													onClose={onToggleDeriveVisible}
													onSave={onSave}
													onUpdate={onUpdateTargetVariable}
													fileId={tableIdentifier?.tableId}
													selectedDefinition={selected}
													originalTable={tableIdentifier?.columns}
												/>
											) : (
												<>
													<DefinitionButton
														text="Capture existing column as variable definition"
														menuProps={columnsMenuProps}
														menuAs={_getMenu}
														allowDisabledFocus
													/>
													{pageType !== PageType.Control && (
														<StepsButton onClick={onToggleDeriveVisible}>
															Derive new column before capturing
														</StepsButton>
													)}
												</>
											)}
										</NormalContainer>
									</StepsContainer>
								</ContainerFlexRow>
							</NormalContainer>
						</Container>
					</Else>
				</If>
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

const DefinitionButton = styled(DefaultButton)`
	width: 100%;
	margin-top: 8px;
`

const StepsButton = styled(DefaultButton)`
	width: 100%;
	margin-top: 8px;
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
	overflow-y: scroll;
	overflow-x: scroll;
	height: 40vh;
`

function _getMenu(props: IContextualMenuProps): JSX.Element {
	return <ContextualMenu {...props} />
}
