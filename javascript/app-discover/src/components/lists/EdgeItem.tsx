/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack, Text, TooltipHost } from '@fluentui/react'
import { memo, useMemo } from 'react'

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
	onPin,
	onRemove,
	onRemoveConstraint,
	onSelect,
	constraint,
	flipAllowed,
}) {
	const isRejected = hasSameReason(ManualRelationshipReason.Removed, constraint)

	const flipTooltip = useMemo((): string => {
		if (hasSameReason(ManualRelationshipReason.Flipped, constraint)) {
			return 'Direction manually reversed. Click to undo it'
		} else if (!flipAllowed) {
			return 'The reverse relationship is not allowed'
		}
		return 'Disallow cause in this direction'
	}, [constraint, flipAllowed])

	const pinTooltip = useMemo((): string => {
		if (hasSameReason(ManualRelationshipReason.Pinned, constraint)) {
			return 'Relationship marked as important. Click to undo it'
		}
		return 'Mark relationship as important'
	}, [constraint, flipAllowed])

	const edgeTitle = useMemo((): string => {
		return isRejected && constraint
			? `${constraint.source.columnName}-${constraint.target.columnName}`
			: columnName
	}, [isRejected, constraint, columnName])

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
						{edgeTitle}
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
								<TooltipHost content={pinTooltip}>
									<IconButtonDark
										toggle
										checked={hasSameReason(
											ManualRelationshipReason.Pinned,
											constraint,
										)}
										// disabled={!flipAllowed}
										iconProps={icons.pin}
										onClick={() => onPin(relationship)}
									/>
								</TooltipHost>
							</Stack.Item>
							<Stack.Item align="center">
								<TooltipHost content={flipTooltip}>
									<IconButtonDark
										toggle
										checked={hasSameReason(
											ManualRelationshipReason.Flipped,
											constraint,
										)}
										disabled={!flipAllowed}
										iconProps={icons.switch}
										onClick={() => onFlip(relationship)}
									/>
								</TooltipHost>
							</Stack.Item>
							<Stack.Item align="center">
								<TooltipHost content="Disallow causes in both directions">
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
								iconProps={icons.delete}
								onClick={() => onRemoveConstraint(relationship)}
							/>
						</TooltipHost>
					</Stack.Item>
				)}
			</Stack>
		</Container>
	)
})
