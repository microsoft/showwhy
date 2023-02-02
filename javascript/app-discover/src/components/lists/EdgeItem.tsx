/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon, Stack, Text, TooltipHost } from '@fluentui/react'
import { memo, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import {
	hasSameReason,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'
import { SelectedCausalDiscoveryAlgorithmState } from '../../state/index.js'
import { IconButtonDark } from '../../styles/styles.js'
import { Container, icons, iconStyle } from './EdgeItem.styles.js'
import type { EdgeItemProps } from './EdgeItem.types.js'

const childrenGap = 5
const cursor = 'pointer'
export const EdgeItem: React.FC<EdgeItemProps> = memo(function EdgeItem({
	relationship,
	columnName,
	onFlip,
	onSave,
	onRemove,
	onRemoveConstraint,
	onSelect,
	constraint,
	flipAllowed,
	notFound,
}) {
	const isRejected = hasSameReason(ManualRelationshipReason.Removed, constraint)
	const selectedCausalDiscoveryAlgorithm = useRecoilValue(
		SelectedCausalDiscoveryAlgorithmState,
	)

	const reason = useMemo((): any => {
		if (notFound) {
			if (
				selectedCausalDiscoveryAlgorithm === CausalDiscoveryAlgorithm.NOTEARS
			) {
				return "algorithm doesn't accept this kind of previous knowledge"
			}
			return "algorithm couldn't find this relationship"
		}
		return ''
	}, [selectedCausalDiscoveryAlgorithm])

	const flipTooltip = useMemo((): string => {
		if (hasSameReason(ManualRelationshipReason.Flipped, constraint)) {
			return 'Direction manually reversed. Click to undo it'
		} else if (!flipAllowed) {
			return 'The reverse relationship is not allowed'
		}
		return 'Disallow cause in this direction'
	}, [constraint, flipAllowed])

	const saveTooltip = useMemo((): string => {
		if (hasSameReason(ManualRelationshipReason.Saved, constraint)) {
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
					<TooltipHost
						style={{ display: notFound ? 'block' : 'none' }}
						content={reason}
					>
						<Text
							style={{
								cursor,
								textDecoration: notFound ? 'line-through' : 'none',
							}}
							onClick={() => (!isRejected ? onSelect(relationship) : undefined)}
						>
							{notFound ? (
								<Icon style={iconStyle} iconName={icons.warning.iconName} />
							) : null}
							{` ${edgeTitle}`}
						</Text>
					</TooltipHost>
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
								<TooltipHost content={saveTooltip}>
									<IconButtonDark
										toggle
										checked={hasSameReason(
											ManualRelationshipReason.Saved,
											constraint,
										)}
										iconProps={icons.save}
										onClick={() => onSave(relationship)}
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
