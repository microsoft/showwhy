/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroTableHeader } from '@data-wrangling-components/react'
import {
	ContextualMenu,
	DefaultButton,
	IContextualMenuProps,
} from '@fluentui/react'
import type { CausalFactor } from '@showwhy/types'
import { memo } from 'react'
import { If, Then, Else } from 'react-if'
import styled from 'styled-components'
import { DeriveComponent } from '../../../pages/PrepareData/ModelVariablesPage/DeriveComponent/DeriveComponent'
import { DefinitionList } from './DefinitionList/DefinitionList'
import { DefinitionSteps } from './DefinitionSteps'
import { Header } from './Header'
import { useBusinessLogic } from './ModelVariablesPage.hooks'
import { EmptyDataPageWarning } from '~components/EmptyDataPageWarning'
import { ArqueroDetailsTable } from '~components/ArqueroDetailsTable'
import { ContainerFlexRow } from '~styles'
import { PageType, Pages } from '~types'

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
					condition={!subjectIdentifier.length || !subjectIdentifierData.table}
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
						<Container>
							<Header />
							<NormalContainer data-pw="table">
								<ArqueroTableHeader
									table={subjectIdentifierData.table}
									showRowCount
									showColumnCount
								/>
								<DetailsListContainer>
									<ArqueroDetailsTable
										table={subjectIdentifierData.table}
										columns={(subjectIdentifierData.columnNames || []).map(
											n => ({
												name: n,
												key: n,
												minWidth: 200,
											}),
										)}
										features={{ smartHeaders: true }}
									/>
								</DetailsListContainer>
								{!tableIdentifier ? null : (
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
										<StepsContainer data-pw="definition-steps">
											<TitleContainer>
												<DefinitionTitle>Definition steps</DefinitionTitle>
											</TitleContainer>
											<DefinitionSteps
												onEdit={onEditClause}
												fileId={tableIdentifier.tableId}
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
														fileId={tableIdentifier.tableId}
														selectedDefinition={selected}
														originalTable={tableIdentifier.table}
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
															<StepsButton
																onClick={onToggleDeriveVisible}
																data-pw="derive-column-button"
															>
																Derive new column before capturing
															</StepsButton>
														)}
													</>
												)}
											</NormalContainer>
										</StepsContainer>
									</ContainerFlexRow>
								)}
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
	height: 40vh;
`

function _getMenu(props: IContextualMenuProps): JSX.Element {
	return <ContextualMenu {...props} />
}
