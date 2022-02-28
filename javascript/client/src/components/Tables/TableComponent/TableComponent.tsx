/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { useTableComponent } from './hooks'
import { GenericTableComponent } from '~components/Tables/GenericTableComponent'
import type {
	PageType,
	ElementDefinition,
	FlatCausalFactor,
	CausalFactor,
	HeaderData,
	Item,
} from '~types'
import type { Handler1, Handler } from '@showwhy/types'

export const TableComponent: React.FC<{
	headers: HeaderData[]
	columns: FlatCausalFactor[] | ElementDefinition[] | Item[]
	definitionToEdit?: ElementDefinition
	factorToEdit?: CausalFactor
	pageType: PageType
	variables?: IComboBoxOption[]
	onDelete?: Handler1<ElementDefinition>
	onEdit?: Handler1<ElementDefinition>
	onCancel?: Handler
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
