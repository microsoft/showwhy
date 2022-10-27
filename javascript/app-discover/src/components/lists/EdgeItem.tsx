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
	onRemoveConstraint,
	onSelect,
	constraint,
}) {
	const isRejected = hasSameReason(ManualRelationshipReason.Removed, constraint)
	return (
		<Container>
			<Stack
				horizontal
				horizontalAlign="space-between"
				tokens={{ childrenGap }}
				verticalAlign="center"
			>
				<Stack.Item>
					<Text
						style={{ cursor }}
						onClick={() => (!isRejected ? onSelect(relationship) : undefined)}
					>
						{isRejected && constraint
							? `${constraint.source.columnName}-${constraint.target.columnName}`
							: columnName}
					</Text>
				</Stack.Item>
				{!isRejected && (
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
										hasSameReason(ManualRelationshipReason.Flipped, constraint)
											? 'Relationship manually reversed. Click to undo it'
											: 'Manually reverse direction of relationship'
									}
								>
									<IconButtonDark
										toggle
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
				)}
				{isRejected && (
					<Stack.Item>
						<TooltipHost content="Remove constraint">
							<IconButtonDark
								iconProps={icons.remove}
								onClick={() => onRemoveConstraint(relationship)}
							/>
						</TooltipHost>
					</Stack.Item>
				)}
			</Stack>
		</Container>
	)
})
