/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { GenericTable } from '@showwhy/components'
import { CausalFactorType } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { Container } from '~styles'

import { useFactorsTable } from './hooks'

export const FactorsTable: React.FC<{
	headers: { fieldName: string; value: string | React.ReactNode }[]
}> = memo(function FactorsTable({ headers }) {
	const { flatFactorsList, itemList } = useFactorsTable()

	return (
		<Container>
			{flatFactorsList.length ? (
				<GenericTable
					items={itemList}
					headers={{ data: headers }}
					props={{
						customColumnsWidth: [
							{ fieldName: 'label', width: '12rem' },
							{ fieldName: CausalFactorType.CauseExposure, width: '10rem' },
							{ fieldName: CausalFactorType.CauseOutcome, width: '10rem' },
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
