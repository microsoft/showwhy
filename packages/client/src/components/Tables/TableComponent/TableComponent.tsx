/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IComboBoxOption } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { useTableComponent } from './hooks'
import { GenericTableComponent } from '~components/Tables/GenericTableComponent'
import { PageType } from '~enums'
import {
	ElementDefinition,
	FlatCausalFactor,
	CausalFactor,
	HeaderData,
	Factor,
} from '~interfaces'

export interface TableProps {
	headers: HeaderData[]
	columns: FlatCausalFactor[] | ElementDefinition[]
	definitionToEdit?: ElementDefinition
	factorToEdit?: CausalFactor
	pageType: PageType
	variables?: IComboBoxOption[]
	onDelete?: (e) => void
	onEdit?: (e) => void
	onCancel?: () => void
	onSave?: (e?) => void
}

export const TableComponent: React.FC<TableProps> = memo(
	function TableComponent({
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
			columns as Factor[],
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
	},
)

const EmptyP = styled.p`
	text-align: center;
`

const Container = styled.div``
