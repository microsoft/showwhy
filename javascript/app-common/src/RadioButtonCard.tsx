/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { CardComponent } from './CardComponent.js'
import { Icon, Option, P, Title } from './RadioButtonCard.styles.js'
import type { RadioButtonChoice } from './RadioButtonCard.types.js'

export const RadioButtonCard: React.FC<{
	option: RadioButtonChoice
}> = memo(function RadioButtonCard({ option }) {
	return (
		<CardComponent
			key={option.key}
			styles={{ margin: 0, padding: 0 }}
			noShaddow
		>
			<Option
				className="radio-option"
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
