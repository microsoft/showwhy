/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDimensions } from '@essex/hooks'
import { DetailsList } from '@showwhy/components'
import type {
	DefinitionType,
	ElementDefinition,
	Handler1,
	Maybe,
} from '@showwhy/types'
import type { FC } from 'react'
import { memo, useRef } from 'react'
import styled from 'styled-components'

import { AlternativeDefinitionsForm } from './AlternativeDefinitionsForm'
import {
	useDefinitionItems,
	useHeaders,
} from './ConsiderAlternativeDefinitionsPage.hooks'

interface PivotData {
	key: string
	title: string
	label: string
	description: string
	items: Record<string, any>[]
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
	const { items } = useDefinitionItems(
		definitions.filter(d => d.type === definitionType),
		definitionToEdit,
		definitionType,
		removeDefinition,
		editDefinition,
		setDefinitionToEdit,
		() => setDefinitionToEdit(undefined),
	)
	const ref = useRef(null)
	const dimensions = useDimensions(ref)
	const { width = 0 } = dimensions || {}
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
