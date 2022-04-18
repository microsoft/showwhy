/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { HeaderData, Item } from '@showwhy/components'
import { GenericTable } from '@showwhy/components'
import type {
	DefinitionType,
	ElementDefinition,
	Handler1,
	Maybe,
} from '@showwhy/types'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import { AlternativeDefinitionsForm } from './AlternativeDefinitionsForm'
import { useTableComponent } from './ConsiderAlternativeDefinitionsPage.hooks'

const tableHeadersList: HeaderData[] = [
	{ fieldName: 'level', value: 'Level' },
	{ fieldName: 'variable', value: 'Label' },
	{ fieldName: 'description', value: 'Description' },
	{ fieldName: 'actions', value: 'Actions' },
]

interface PivotData {
	key: string
	title: string
	label: string
	description: string
	items: Item[]
}

export const PivotType: FC<{
	item: PivotData
	definitionToEdit: Maybe<ElementDefinition>
	shouldHavePrimary: boolean
	definitionType: DefinitionType
	addDefinition: Handler1<ElementDefinition>
	editDefinition: Handler1<ElementDefinition>
	removeDefinition: Handler1<ElementDefinition>
	setDefinitionToEdit: Handler1<Maybe<ElementDefinition>>
	definitions: ElementDefinition[]
}> = memo(function PivotType({
	item,
	shouldHavePrimary,
	definitionType,
	addDefinition,
	editDefinition,
	definitions,
	definitionToEdit,
	setDefinitionToEdit,
	removeDefinition,
}) {
	const { items } = useTableComponent(
		definitions.filter(d => d.type === definitionType),
		definitionToEdit,
		undefined,
		removeDefinition,
		editDefinition,
		setDefinitionToEdit,
		() => setDefinitionToEdit(undefined),
		definitionType,
	)

	return (
		<Container>
			<DetailsText>{item.label}</DetailsText>
			<DetailsText>{item.description}</DetailsText>
			<GenericTable
				headers={{ data: tableHeadersList }}
				items={items}
				props={{
					customColumnsWidth: [
						{ fieldName: 'level', width: '15%' },
						{ fieldName: 'variable', width: '35%' },
						{ fieldName: 'description', width: `40%` },
						{ fieldName: 'actions', width: '10%' },
					],
				}}
			></GenericTable>
			<Container>
				<TableContainer>
					<AlternativeDefinitionsForm
						shouldHavePrimary={shouldHavePrimary}
						definitionType={definitionType}
						onAdd={addDefinition}
					/>
				</TableContainer>
			</Container>
		</Container>
	)
})

const Container = styled.div``

const TableContainer = styled.div`
	margin-bottom: 24px;
`

const DetailsText = styled.span`
	display: flex;
	flex-direction: column;
	margin-top: 0.5rem;
`
