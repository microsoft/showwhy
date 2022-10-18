/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, Stack, Text } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { ManualRelationshipReason } from '../../domain/Relationship.js'
import type { EdgeItemProps } from './EdgeItem.types.js'

export const EdgeItem: React.FC<EdgeItemProps> = memo(function EdgeItem({
	relationship,
	columnName,
	onFlip,
	onRemove,
	onPin,
	onSelect,
}) {
	return (
		<RelationshipContainer>
			<Stack
				horizontal
				horizontalAlign="space-between"
				tokens={{ childrenGap: 5 }}
				verticalAlign="center"
			>
				<Stack.Item>
					<Text
						style={{ cursor: 'pointer' }}
						onClick={() => onSelect(relationship)}
					>
						{columnName}
					</Text>
				</Stack.Item>
				<Stack.Item>
					<Stack
						horizontal
						horizontalAlign="space-between"
						tokens={{ childrenGap: 5 }}
						verticalAlign="center"
					>
						<Stack.Item>
							<Text variant={'tiny'}>{relationship?.weight?.toFixed(2)}</Text>
						</Stack.Item>
						<Stack.Item align="center">
							<IconButton
								toggle
								checked={
									relationship.reason === ManualRelationshipReason.Pinned
								}
								iconProps={
									relationship.reason === ManualRelationshipReason.Pinned
										? icons.pinned
										: icons.pin
								}
								onClick={() => onPin(relationship)}
							/>
						</Stack.Item>
						<Stack.Item align="center">
							<IconButton
								iconProps={icons.switch}
								onClick={() => onFlip(relationship)}
							/>
						</Stack.Item>
						<Stack.Item align="center">
							<IconButton
								iconProps={icons.delete}
								onClick={() => onRemove(relationship)}
							/>
						</Stack.Item>
					</Stack>
				</Stack.Item>
			</Stack>
		</RelationshipContainer>
	)
})

const RelationshipContainer = styled.div``

const icons = {
	delete: { iconName: 'Delete' },
	pin: { iconName: 'Pin' },
	switch: { iconName: 'Switch' },
	pinned: { iconName: 'PinSolid12' },
}
