/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { CardComponent } from './CardComponent.js'
import type { RadioButtonChoice } from './CardComponent.types.js'

export const RadioButtonCard: React.FC<{
	option: RadioButtonChoice
}> = memo(function RadioButtonCard({ option }) {
	return (
		<CardComponent key={option.key} styles={{ margin: 0, padding: 0 }}>
			<Option
				onClick={() => option.onChange(option)}
				data-pw={`${option.isSelected ? 'selected-' : ''}radio-option`}
			>
				<Title>
					<Icon iconName={`RadioBtn${option.isSelected ? 'On' : 'Off'}`} />
					{option.title}
				</Title>
				<P>{option.description}</P>
			</Option>
		</CardComponent>
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

const Option = styled.div`
	padding: 1rem;
	cursor: pointer;
`

const Icon = styled(FontIcon)`
	color: ${({ theme }) => theme.application().accent};
`

const P = styled.p``
