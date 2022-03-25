/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption } from '@fluentui/react'
import type {
	CausalFactor,
	ElementDefinition,
	FlatCausalFactor,
	Handler,
	Handler1,
} from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { GenericTableComponent } from '~components/Tables/GenericTableComponent'
import type { HeaderData, Item, PageType } from '~types'

import { useTableComponent } from './hooks'

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
		onDelete,
		onSave,
		onEdit,
		onCancel,
	)
	return (
		<Container>
			<GenericTableComponent
				items={items}
				headers={{
					data: headersData,
				}}
				props={{ customColumnsWidth }}
			/>
		</Container>
	)
})

const Container = styled.div``
