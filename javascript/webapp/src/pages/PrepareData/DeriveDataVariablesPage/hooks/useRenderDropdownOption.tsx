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
	Definition,
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
import { useCallout, useSelectedColumn } from '../DeriveDataVariablesPage.state'

const buttonStyles = {
	root: {
		width: 190,
	},
	label: {
		width: 150,
		lineHeight: 'unset',
	},
}

export function useRenderDropdown(
	allElements: FactorsOrDefinitions,
	onSelect: (option: Maybe<IContextualMenuItem>, columnName: string) => void,
	onResetVariable: (columnName: string) => void,
	onSelectIdentifier: (columnName: string) => void,
	subjectIdentifier: Maybe<string>,
	dropdownOptions: IContextualMenuItem[],
): (columnName: string) => JSX.Element {
	const selectedOptions = useSelectedOptions(allElements)
	const isSelected = useSelectedOptionByColumnAndVariable(allElements)
	const selectedVariableByColumn = useSelectedOptionByColumn(allElements)
	const onAddVariable = useOnAddVariable()
	const handleOnClick = useCallback(
		(option: any, columnName: string) => {
			const type = option.data?.type
			switch (type) {
				case CommandActionType.Reset:
					return onResetVariable(columnName)
				case CommandActionType.AddVariable:
					return onAddVariable(columnName)
				case CommandActionType.SubjectIdentifier:
					return onSelectIdentifier(columnName)
				default:
					return onSelect(option, columnName)
			}
		},
		[onResetVariable, onAddVariable, onSelectIdentifier, onSelect],
	)

	const renderMenuList = useRenderMenuList(
		dropdownOptions,
		selectedVariableByColumn,
		subjectIdentifier,
	)

	return useCallback(
		(columnName: string) => {
			const filtered: IContextualMenuItem[] = getFilteredItems(
				dropdownOptions,
				selectedOptions,
				columnName,
				isSelected,
			)

			const menuProps = {
				items: filtered,
				onRenderMenuList: (menuListProps: Maybe<IContextualMenuListProps>) =>
					renderMenuList(menuListProps as IContextualMenuListProps, columnName),
				onItemClick: (_: any, option: any) => handleOnClick(option, columnName),
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
			isSelected,
			renderMenuList,
			selectedOptions,
			selectedVariableByColumn,
			subjectIdentifier,
			handleOnClick,
		],
	)
}

function useOnAddVariable() {
	const [, toggleCallout] = useCallout()
	const [, setSelectedColumn] = useSelectedColumn()
	return useCallback(
		(columnName: string) => {
			setSelectedColumn(columnName)
			toggleCallout()
		},
		[toggleCallout, setSelectedColumn],
	)
}

function useRenderMenuList(
	dropdownOptions: IContextualMenuItem[],
	selectedVariableByColumn: (
		columnName: string,
	) => Maybe<Definition | CausalFactor>,
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
			const resetButton = findByType(dropdownOptions, CommandActionType.Reset)
			const variableButton = findByType(
				dropdownOptions,
				CommandActionType.AddVariable,
			)
			const identifierButton = findByType(
				dropdownOptions,
				CommandActionType.SubjectIdentifier,
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

function findByType(options: IContextualMenuItem[], type: string) {
	return options.find(x => x.data?.type === type)
}

function getFilteredItems(
	dropdownOptions: IContextualMenuItem[],
	selectedOptions: string[],
	columnName: string,
	isSelected: (
		text: string,
		columnName: string,
	) => Maybe<Definition | CausalFactor>,
): IContextualMenuItem[] {
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
	return filtered
}

const Container = styled.div``
