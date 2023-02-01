/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react'
import { CommandButton, FocusZone, Label, TooltipHost } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'

import type { Relationship } from '../../domain/Relationship.js'
import { involvesVariable } from '../../domain/Relationship.js'
import { useCausalGraph } from '../../state/index.js'
import { IconButtonDark } from '../../styles/styles.js'
import { savedNotFound } from '../../utils/Constraints.js'
import {
	useOnFlip,
	useOnRemove,
	useOnRemoveAll,
	useOnRemoveConstraint,
	useOnRenderItem,
	useOnSave,
} from './EdgeList.hooks.js'
import { Container, icons, LabelContainer } from './EdgeList.styles.js'
import type { EdgeListProps } from './EdgeList.types.js'
import {
	groupByEffectType,
	isColumnRelated,
	rejectedItems,
} from './EdgeList.utils.js'

export const EdgeList: React.FC<EdgeListProps> = memo(function EdgeList({
	relationships,
	variable,
	onSelect,
	constraints,
	onUpdateConstraints,
	graphVariables,
}) {
	const variables = useCausalGraph().variables

	const groupedList = groupByEffectType(relationships, variable, constraints)
	const removedItems = rejectedItems(constraints, variable)
	const onRemove = useOnRemove(constraints, onUpdateConstraints)
	const onSave = useOnSave(constraints, onUpdateConstraints)
	const onFlip = useOnFlip(constraints, onUpdateConstraints)
	const onRemoveAll = useOnRemoveAll(
		constraints,
		onUpdateConstraints,
		variable,
		relationships,
	)
	const onRemoveConstraint = useOnRemoveConstraint(
		constraints,
		onUpdateConstraints,
	)

	const renderItem = useOnRenderItem(
		onSelect,
		onFlip,
		onSave,
		onRemove,
		onRemoveConstraint,
		variable,
		constraints,
	)

	const addSaved = useCallback(
		(groupName: string, option?: IContextualMenuItem) => {
			let relationship = {
				source: { columnName: variable.columnName },
				target: { columnName: option?.key as string },
			} as Relationship
			if (groupName.includes('Causes')) {
				relationship = {
					source: { columnName: option?.key as string },
					target: { columnName: variable.columnName },
				} as Relationship
			}

			onSave(relationship)
		},
		[onSave, variable],
	)

	const availableVariables = useMemo((): IContextualMenuItem[] => {
		return graphVariables
			.map((columnName) => {
				if (columnName !== variable.columnName) {
					const isRelated = isColumnRelated(
						columnName,
						variable.columnName,
						constraints,
					)

					if (!isRelated) {
						return {
							key: columnName,
							text: columnName,
						}
					}
				}
			})
			.filter((x) => x) as IContextualMenuItem[]
	}, [graphVariables, constraints])

	const menuItems = useCallback(
		(groupName: string): IContextualMenuProps => {
			return {
				shouldFocusOnMount: true,
				items: availableVariables,
				onItemClick: (_, item) => addSaved(groupName, item),
			} as IContextualMenuProps
		},
		[availableVariables],
	)

	const savedNotReturned = useMemo(() => {
		const allVariables = variables?.map((v) => v.columnName)

		return constraints.manualRelationships.filter(
			(constraint) =>
				savedNotFound(relationships, constraint, allVariables) &&
				involvesVariable(constraint, variable),
		)
	}, [relationships, constraints, variable, variables])

	const groupedNotFound = groupByEffectType(
		savedNotReturned,
		variable,
		constraints,
	)

	return (
		<FocusZone>
			{Object.keys(groupedList).flatMap((groupName) => {
				return (
					<Container key={groupName}>
						<LabelContainer>
							<Label>{groupName}</Label>
							{!!groupedList[groupName].length && (
								<TooltipHost content={'Disallow these causes'}>
									<IconButtonDark
										onClick={() => onRemoveAll(groupName)}
										iconProps={icons.remove}
									/>
								</TooltipHost>
							)}
						</LabelContainer>
						{groupedList[groupName].map((r) => renderItem(r))}
						{groupedNotFound[groupName]
							.filter((r) => !groupedList[groupName].includes(r))
							.map((r) => renderItem(r, true))}
						<CommandButton
							text="+ add new variable"
							menuProps={menuItems(groupName)}
						/>
					</Container>
				)
			})}
			{!!removedItems.length && <Label>Disallowed edges</Label>}
			{removedItems.map((relationship) => {
				return (
					<Container key={relationship.key}>
						{renderItem(relationship)}
					</Container>
				)
			})}
		</FocusZone>
	)
})
