/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ColumnarMenu, ColumnarMenuList } from '@essex/themed-components'
import type {
	IContextualMenuItem,
	IContextualMenuListProps,
} from '@fluentui/react'
import type {
	CausalFactor,
	ElementDefinition,
	FactorsOrDefinitions,
	Maybe,
} from '@showwhy/types'
import { CommandActionType } from '@showwhy/types'
import { useCallback } from 'react'
import styled from 'styled-components'

import {
	useSelectedOptionByColumn,
	useSelectedOptionByColumnAndVariable,
	useSelectedOptions,
} from '../DeriveDataVariablesPage.hooks'

const buttonStyles = {
	root: {
		width: 190,
	},
	label: {
		width: 150,
		lineHeight: 'unset',
	},
}

function useRenderMenuList(
	dropdownOptions: IContextualMenuItem[],
	selectedVariableByColumn: (
		columnName: string,
	) => Maybe<ElementDefinition | CausalFactor>,
	subjectIdentifier: Maybe<string>,
): (
	menuListProps: IContextualMenuListProps,
	columnName: string,
) => JSX.Element {
	return useCallback(
		(
			menuListProps: IContextualMenuListProps,
			columnName: string,
		): JSX.Element => {
			let { items } = menuListProps || []
			const resetButton = dropdownOptions.find(
				x => x.data?.type === CommandActionType.Reset,
			)
			const variableButton = dropdownOptions.find(
				x => x.data?.type === CommandActionType.AddVariable,
			)
			const identifierButton = dropdownOptions.find(
				x => x.data?.type === CommandActionType.SubjectIdentifier,
			)
			const hasVariable = !selectedVariableByColumn(columnName)?.variable
			const isIdentifier = subjectIdentifier === columnName
			items = items.filter(x => !x.data?.button)
			if (identifierButton) {
				identifierButton.disabled = !hasVariable
				identifierButton.text = `${
					isIdentifier ? 'Unset' : 'Set'
				} as subject identifier`
				items.push(identifierButton)
			}
			if (resetButton) {
				resetButton.disabled = hasVariable
				items.push(resetButton)
			}
			if (variableButton) {
				variableButton.disabled = !hasVariable || isIdentifier
				items.push(variableButton)
			}
			return (
				<>
					<ColumnarMenuList
						{...(menuListProps as IContextualMenuListProps)}
						items={items}
					/>
				</>
			)
		},
		[dropdownOptions, selectedVariableByColumn, subjectIdentifier],
	)
}

export function useRenderDropdown(
	allElements: FactorsOrDefinitions,
	onSelect: (option: Maybe<IContextualMenuItem>, columnName: string) => void,
	onResetVariable: (columnName: string) => void,
	onAddVariable: (columnName: string) => void,
	onSelectIdentifier: (columnName: string) => void,
	subjectIdentifier: Maybe<string>,
	dropdownOptions: IContextualMenuItem[],
): (columnName: string) => JSX.Element {
	const selectedOptions = useSelectedOptions(allElements)
	const isSelected = useSelectedOptionByColumnAndVariable(allElements)
	const selectedVariableByColumn = useSelectedOptionByColumn(allElements)
	const renderMenuList = useRenderMenuList(
		dropdownOptions,
		selectedVariableByColumn,
		subjectIdentifier,
	)

	return useCallback(
		(columnName: string) => {
			const filtered: IContextualMenuItem[] = []

			dropdownOptions.forEach(item => {
				const subitems =
					item.sectionProps?.items.filter(
						subitem =>
							isSelected(subitem?.text || '', columnName) ||
							!selectedOptions.includes(subitem?.text || ''),
					) || []

				if (subitems.length > 0) {
					filtered.push({
						...item,
						sectionProps: {
							...item.sectionProps,
							items: subitems,
						},
					})
				} else if (item.data?.button) {
					filtered.push(item)
				}
			})

			const menuProps = {
				items: filtered,
				onRenderMenuList: (menuListProps: Maybe<IContextualMenuListProps>) =>
					renderMenuList(menuListProps as IContextualMenuListProps, columnName),
				onItemClick: (_: any, option: any) =>
					option.data?.type === CommandActionType.Reset
						? onResetVariable(columnName)
						: option.data?.type === CommandActionType.AddVariable
						? onAddVariable(columnName)
						: option.data?.type === CommandActionType.SubjectIdentifier
						? onSelectIdentifier(columnName)
						: onSelect(option, columnName),
				buttonStyles,
			}

			const variable = `${
				subjectIdentifier === columnName
					? ' Subject identifier'
					: selectedVariableByColumn(columnName)?.variable ?? 'Options'
			}`

			return (
				<Container id={columnName} title={variable}>
					<ColumnarMenu text={variable} {...menuProps} />
				</Container>
			)
		},
		[
			dropdownOptions,
			onSelect,
			onResetVariable,
			isSelected,
			renderMenuList,
			selectedOptions,
			selectedVariableByColumn,
			onAddVariable,
			onSelectIdentifier,
			subjectIdentifier,
		],
	)
}

const Container = styled.div``
