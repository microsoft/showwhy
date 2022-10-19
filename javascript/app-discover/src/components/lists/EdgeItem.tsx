/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack, Text, TooltipHost } from '@fluentui/react'
import { memo } from 'react'

import { ManualRelationshipReason } from '../../domain/Relationship.js'
import { IconButtonDark } from '../../styles/styles.js'
import { Container, icons } from './EdgeItem.styles.js'
import type { EdgeItemProps } from './EdgeItem.types.js'

export const EdgeItem: React.FC<EdgeItemProps> = memo(function EdgeItem({
	relationship,
	columnName,
	onFlip,
	onRemove,
	onPin,
	onSelect,
	constraint,
}) {
	return (
		<Container>
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
							<TooltipHost
								content={
									constraint?.reason === ManualRelationshipReason.Pinned
										? 'Relationship confirmed as relevant by the user. Click to undo it'
										: 'Confirm as relevant relationship'
								}
							>
								<IconButtonDark
									toggle
									checked={
										constraint?.reason === ManualRelationshipReason.Pinned
									}
									iconProps={
										constraint?.reason === ManualRelationshipReason.Pinned
											? icons.pinned
											: icons.pin
									}
									onClick={() => onPin(relationship)}
								/>
							</TooltipHost>
						</Stack.Item>
						<Stack.Item align="center">
							<TooltipHost
								content={
									constraint?.reason === ManualRelationshipReason.Flipped
										? 'Relationship manually reversed by the user. Click to undo it'
										: 'Manually reverse direction of relationship'
								}
							>
								<IconButtonDark
									toggle
									checked={
										constraint?.reason === ManualRelationshipReason.Flipped
									}
									iconProps={icons.switch}
									onClick={() => onFlip(relationship)}
								/>
							</TooltipHost>
						</Stack.Item>
						<Stack.Item align="center">
							<TooltipHost content="Remove relationship">
								<IconButtonDark
									iconProps={icons.delete}
									onClick={() => onRemove(relationship)}
								/>
							</TooltipHost>
						</Stack.Item>
					</Stack>
				</Stack.Item>
			</Stack>
		</Container>
	)
})
