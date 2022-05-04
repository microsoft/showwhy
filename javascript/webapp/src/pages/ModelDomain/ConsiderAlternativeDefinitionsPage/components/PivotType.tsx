/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DetailsList } from '@showwhy/components'
import type { Definition } from '@showwhy/types'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import { useDimensions } from '~hooks'
import { useDefinitionType } from '~state'

import { useDefinitionToEdit } from '../ConsiderAlternativeDefinitions.state'
import {
	useDefinitionItems,
	useHeaders,
} from '../ConsiderAlternativeDefinitionsPage.hooks'
import { usePivotType } from '../hooks/usePivotType'
import { AlternativeDefinitionsForm } from './AlternativeDefinitionsForm'

interface PivotData {
	key: string
	title: string
	label: string
	description: string
	items: Record<string, any>[]
}

export const PivotType: FC<{
	item: PivotData
	definitions: Definition[]
}> = memo(function PivotType({ item, definitions }) {
	const definitionType = useDefinitionType()
	const [definitionToEdit, setDefinitionToEdit] = useDefinitionToEdit()
	const { shouldHavePrimary, editDefinition, addDefinition, removeDefinition } =
		usePivotType(definitions, definitionType)
	const { items } = useDefinitionItems(
		definitions.filter(d => d.type === definitionType),
		definitionToEdit,
		definitionType,
		removeDefinition,
		editDefinition,
		setDefinitionToEdit,
		() => setDefinitionToEdit(undefined),
	)
	const { ref, width } = useDimensions()
	const headers = useHeaders(width)

	return (
		<Container ref={ref}>
			<DetailsText>{item.label}</DetailsText>
			<DetailsText>{item.description}</DetailsText>
			<DetailsList headers={headers} items={items} />
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
