/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DetailsList, DetailsListLayoutMode, SelectionMode } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { Container } from '~styles'
import { getColumns } from './columns'

import { useFactorsTable } from './hooks'
import { onRenderRow } from './onRenderRow'

export const FactorsTable: React.FC = memo(function FactorsTable() {
	const { flatFactorsList, itemList } = useFactorsTable()
	const columns = getColumns()

	return (
		<Container>
			{flatFactorsList.length ? (
				<DetailsList
					compact={true}
					selectionMode={SelectionMode.none}
					layoutMode={DetailsListLayoutMode.justified}
					items={itemList}
					columns={columns}
					onRenderRow={onRenderRow}
				/>
			) : (
				<EmptyFactorsText>Add a new factor to start</EmptyFactorsText>
			)}
		</Container>
	)
})

const EmptyFactorsText = styled.p`
	text-align: center;
`
