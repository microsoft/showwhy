/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Stack, TooltipHost } from '@fluentui/react'
import { memo } from 'react'

import type { VariableReference } from '../../domain/CausalVariable.js'
import type { Relationship } from '../../domain/Relationship.js'
import { IconButtonDark } from '../../styles/styles.js'

export const Constraint: React.FC<{
	constraint: Relationship
	onRemove: (relationship: Relationship) => void
}> = memo(function Constraint({ constraint, onRemove }) {
	return (
		<Stack
			horizontal
			verticalAlign="center"
			key={`${constraint.source.columnName}-${constraint.target.columnName}`}
		>
			<Stack.Item
				grow
			>{`${constraint.source.columnName}-${constraint.target.columnName}`}</Stack.Item>
			<Stack.Item>
				<TooltipHost content="Remove constraint">
					<IconButtonDark
						iconProps={icons.remove}
						onClick={() => onRemove(constraint)}
					/>
				</TooltipHost>
			</Stack.Item>
		</Stack>
	)
})

export const GeneralConstraint: React.FC<{
	constraint: VariableReference
	onRemove: (variable: VariableReference) => void
}> = memo(function Constraint({ constraint, onRemove }) {
	return (
		<Stack horizontal verticalAlign="center" key={`${constraint.columnName}`}>
			<Stack.Item grow>{`${constraint.columnName}`}</Stack.Item>
			<Stack.Item>
				<TooltipHost content="Remove constraint">
					<IconButtonDark
						iconProps={icons.remove}
						onClick={() => onRemove(constraint)}
					/>
				</TooltipHost>
			</Stack.Item>
		</Stack>
	)
})

const icons = {
	remove: { iconName: 'StatusCircleErrorX' },
}
