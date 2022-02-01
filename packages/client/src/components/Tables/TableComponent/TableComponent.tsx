/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IComboBoxOption } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { useTableComponent } from './hooks'
import { GenericTableComponent } from '~components/Tables/GenericTableComponent'
import {
	PageType,
	ElementDefinition,
	FlatCausalFactor,
	CausalFactor,
	HeaderData,
	Item,
	Handler1,
	Handler0,
} from '~types'

export const TableComponent: React.FC<{
	headers: HeaderData[]
	columns: FlatCausalFactor[] | ElementDefinition[] | Item[]
	definitionToEdit?: ElementDefinition
	factorToEdit?: CausalFactor
	pageType: PageType
	variables?: IComboBoxOption[]
	onDelete?: Handler1<ElementDefinition>
	onEdit?: Handler1<ElementDefinition>
	onCancel?: Handler0
	onSave?: Handler1<ElementDefinition>
}> = memo(function TableComponent({
	headers,
	columns,
	definitionToEdit,
	factorToEdit,
	pageType,
	variables,
	onDelete,
	onEdit,
	onCancel,
	onSave,
}) {
	const { items, customColumnsWidth, headersData } = useTableComponent(
		columns as CausalFactor[],
		headers,
		definitionToEdit,
		factorToEdit,
		pageType,
		variables,
		onDelete,
		onSave,
		onEdit,
		onCancel,
	)
	return (
		<Container>
			{items.length ? (
				<GenericTableComponent
					items={items}
					headers={{
						data: headersData,
					}}
					props={{ customColumnsWidth }}
				/>
			) : (
				<EmptyP>Add a new factor to start</EmptyP>
			)}
		</Container>
	)
})

const EmptyP = styled.p`
	text-align: center;
`

const Container = styled.div``
