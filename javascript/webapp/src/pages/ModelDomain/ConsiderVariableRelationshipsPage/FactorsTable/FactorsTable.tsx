/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Container, DetailsList } from '@showwhy/components'
import { memo } from 'react'
import styled from 'styled-components'

import { useDimensions } from '~hooks'

import { useFactorsTable, useHeaders } from './hooks'

export const FactorsTable: React.FC = memo(function FactorsTable() {
	const { flatFactorsList, itemList } = useFactorsTable()
	const { ref, width } = useDimensions()
	const headers = useHeaders(width)

	return (
		<Container ref={ref}>
			{flatFactorsList.length ? (
				<DetailsList headers={headers} items={itemList} />
			) : (
				<EmptyFactorsText>Add a new factor to start</EmptyFactorsText>
			)}
		</Container>
	)
})

const EmptyFactorsText = styled.p`
	text-align: center;
`
