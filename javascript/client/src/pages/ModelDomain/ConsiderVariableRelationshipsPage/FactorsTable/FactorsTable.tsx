/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useDimensions } from '@essex/hooks'
import { Container, DetailsList } from '@showwhy/components'
import { memo, useRef } from 'react'
import styled from 'styled-components'

import { useFactorsTable, useHeaders } from './hooks'

export const FactorsTable: React.FC = memo(function FactorsTable() {
	const { flatFactorsList, itemList } = useFactorsTable()
	const ref = useRef(null)
	const dimensions = useDimensions(ref)
	const { width = 0 } = dimensions || {}
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
