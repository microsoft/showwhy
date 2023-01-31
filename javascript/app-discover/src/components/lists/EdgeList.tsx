/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown, FocusZone, Label, TooltipHost } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { Relationship } from '../../domain/Relationship.js'
import { SelectedCausalDiscoveryAlgorithmState } from '../../state/index.js'
import { IconButtonDark } from '../../styles/styles.js'
import {
	useOnFlip,
	useOnPin,
	useOnRemove,
	useOnRemoveAll,
	useOnRemoveConstraint,
	useOnRenderItem,
} from './EdgeList.hooks.js'
import { Container, icons, LabelContainer } from './EdgeList.styles.js'
import type { EdgeListProps } from './EdgeList.types.js'
import { groupByEffectType, rejectedItems } from './EdgeList.utils.js'

export const EdgeList: React.FC<EdgeListProps> = memo(function EdgeList({
	relationships,
	variable,
	onSelect,
	constraints,
	onUpdateConstraints,
	graphVariables,
}) {
	const groupedList = groupByEffectType(
		relationships,
		variable.columnName,
		constraints,
	)
	const removedItems = rejectedItems(constraints, variable)
	const onRemove = useOnRemove(constraints, onUpdateConstraints)
	const onPin = useOnPin(constraints, onUpdateConstraints)
	const onFlip = useOnFlip(constraints, onUpdateConstraints)
	const selectedCausalDiscoveryAlgorithm = useRecoilValue(
		SelectedCausalDiscoveryAlgorithmState,
	)
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
		onPin,
		onRemove,
		onRemoveConstraint,
		variable,
		constraints,
	)

	const addPin = useCallback(
		(groupName: string, option?: IDropdownOption) => {
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

			onPin(relationship)
		},
		[onPin, variable],
	)

	//variaveis que nao estao sendo target de uma relacao source=variavel
	// variavel causa tal coisa. variavel = source
	const relatedVariables = useMemo((): IDropdownOption[] => {
		return graphVariables
			.map((columnName) => {
				if (columnName !== variable.columnName) {
					const allConstraints = Object.values(constraints).flatMap((x) => x)
					const isRelated = allConstraints.some(({ source, target }) => {
						return (
							(source.columnName === columnName &&
								target.columnName === variable.columnName) ||
							(target.columnName === columnName &&
								source.columnName === variable.columnName)
						)
					})
					if (!isRelated) {
						return {
							key: columnName,
							text: columnName,
						}
					}
				}
			})
			.filter((x) => x) as IDropdownOption[]
	}, [graphVariables, constraints])

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

						{selectedCausalDiscoveryAlgorithm !==
							CausalDiscoveryAlgorithm.NOTEARS && (
							<Dropdown
								onChange={(_, o) => addPin(groupName, o)}
								options={relatedVariables}
							/>
						)}
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
