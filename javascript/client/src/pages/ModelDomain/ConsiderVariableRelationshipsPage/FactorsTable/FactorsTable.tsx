/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DetailsList, DetailsListLayoutMode, SelectionMode } from '@fluentui/react'
import { CausalFactorType } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { Container } from '~styles'
import { getColumns, onRenderRow } from '~utils'

import { useFactorsTable } from './hooks'

const headers = [
	{ fieldName: 'variable', name: 'Label', width: 300 },
	{ fieldName: CausalFactorType.CauseExposure, name: 'Causes Exposure', width: 150 },
	{ fieldName: CausalFactorType.CauseOutcome, name: 'Causes Outcome', width: 150 },
	{ fieldName: 'reasoning', name: 'Reasoning', width: 500 },
]

export const FactorsTable: React.FC = memo(function FactorsTable() {
	const { flatFactorsList, itemList } = useFactorsTable()
	const columns = getColumns(headers)

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
