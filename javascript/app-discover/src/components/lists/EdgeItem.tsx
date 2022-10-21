/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack, Text, TooltipHost } from '@fluentui/react'
import { memo } from 'react'

import {
	hasSameReason,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'
import { IconButtonDark } from '../../styles/styles.js'
import { Container, icons } from './EdgeItem.styles.js'
import type { EdgeItemProps } from './EdgeItem.types.js'

const childrenGap = 5
const cursor = 'pointer'
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
				tokens={{ childrenGap }}
				verticalAlign="center"
			>
				<Stack.Item>
					<Text style={{ cursor }} onClick={() => onSelect(relationship)}>
						{columnName}
					</Text>
				</Stack.Item>
				<Stack.Item>
					<Stack
						horizontal
						horizontalAlign="space-between"
						tokens={{ childrenGap }}
						verticalAlign="center"
					>
						<Stack.Item>
							<Text variant={'tiny'}>{relationship?.weight?.toFixed(2)}</Text>
						</Stack.Item>
						<Stack.Item align="center">
							<TooltipHost
								content={
									hasSameReason(ManualRelationshipReason.Pinned, constraint)
										? 'Relationship confirmed as relevant. Click to undo'
										: 'Confirm relationship as relevant'
								}
							>
								<IconButtonDark
									toggle
									checked={hasSameReason(
										ManualRelationshipReason.Pinned,
										constraint,
									)}
									disabled={hasSameReason(
										ManualRelationshipReason.Flipped,
										constraint,
									)}
									iconProps={
										hasSameReason(ManualRelationshipReason.Pinned, constraint)
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
									hasSameReason(ManualRelationshipReason.Flipped, constraint)
										? 'Relationship manually reversed. Click to undo it'
										: 'Manually reverse direction of relationship'
								}
							>
								<IconButtonDark
									toggle
									disabled={hasSameReason(
										ManualRelationshipReason.Pinned,
										constraint,
									)}
									checked={hasSameReason(
										ManualRelationshipReason.Flipped,
										constraint,
									)}
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
