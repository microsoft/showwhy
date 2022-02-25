/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { CardComponent } from '~components/CardComponent'
import type { RefutationChoice } from '~types'

export const RefutationTests: React.FC<{
	options: RefutationChoice[]
}> = memo(function RefutationTests({ options }) {
	return (
		<Container>
			{options.map(option => (
				<CardComponent key={option.key}>
					<RefutationOption
						onClick={option.onChange}
						data-pw={`${option.isSelected ? 'selected-' : ''}refuter`}
					>
						<Title>
							<Icon iconName={`RadioBtn${option.isSelected ? 'On' : 'Off'}`} />
							{option.title}
						</Title>
						<P>{option.description}</P>
					</RefutationOption>
				</CardComponent>
			))}
		</Container>
	)
})

const Title = styled.h3`
	font-size: 1.1rem;
	font-weight: 500;
	margin: 0;
	display: grid;
	align-items: center;
	grid-template-columns: 5% auto;
	gap: 1rem;
`

const RefutationOption = styled.div`
	padding: 1rem;
	cursor: pointer;
`

const Container = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
`

const Icon = styled(FontIcon)`
	color: ${({ theme }) => theme.application().accent};
`

const P = styled.p``
