/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'
import styled from 'styled-components'

import { GenericTableComponent } from '~components/Tables/GenericTableComponent'
import { Container } from '~styles'

import { useFactorsTable } from './hooks'

export const FactorsTable: React.FC<{
	headers: { fieldName: string; value: string | React.ReactNode }[]
}> = memo(function FactorsTable({ headers }) {
	const { flatFactorsList, itemList } = useFactorsTable()

	return (
		<Container>
			{flatFactorsList.length ? (
				<GenericTableComponent
					items={itemList}
					headers={{ data: headers }}
					props={{
						customColumnsWidth: [
							{ fieldName: 'variable', width: '12rem' },
							{ fieldName: 'exposure', width: '10rem' },
							{ fieldName: 'outcome', width: '10rem' },
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
