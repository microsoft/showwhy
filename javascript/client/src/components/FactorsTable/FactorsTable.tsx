/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'
import styled from 'styled-components'
import { useFactorsTable } from './FactorsTable.hooks'
import { PopulatedDataTable } from '~components/PopulatedDataTable'
import { Container } from '~styles'

export const FactorsTable: React.FC<{
	headers: { fieldName: string; value: string | React.ReactNode }[]
	causeType: string
}> = memo(function FactorsTable({ headers, causeType }) {
	const { flatFactorsList, itemList } = useFactorsTable(causeType)

	return (
		<Container>
			{flatFactorsList.length ? (
				<PopulatedDataTable
					items={itemList}
					headers={{ data: headers }}
					props={{
						customColumnsWidth: [
							{ fieldName: 'causes', width: '12%' },
							{ fieldName: 'degree', width: '17%' },
						],
					}}
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
