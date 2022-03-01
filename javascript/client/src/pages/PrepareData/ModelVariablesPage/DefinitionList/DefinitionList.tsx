/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CausalFactor } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'
import { useDefinitionList } from './DefinitionList.hooks'
import { PopulatedDataTable } from '~components/PopulatedDataTable'

export const DefinitionList: React.FC<{
	list: CausalFactor[]
	onClick: (option: CausalFactor) => void
	selectedDefinition: string
	type: string
	tableId: string
	onUpdate: (definition: string) => void
}> = memo(function DefinitionList({ list, onClick, type, tableId, onUpdate }) {
	const { itemList } = useDefinitionList(list, onClick, type, tableId, onUpdate)

	return (
		<Container data-pw="definition-list">
			<PopulatedDataTable
				items={itemList}
				props={{ styles: { width: '45%' } }}
			/>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: column;
	padding-right: 8px;
	max-height: 33vh;
`
