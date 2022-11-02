/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ColumnarMenu, ColumnarMenuList } from '@essex/components'
import type {
	IContextualMenuItem,
	IContextualMenuListProps,
	IRawStyle,
} from '@fluentui/react'
import { useCallback } from 'react'
import styled from 'styled-components'

import {
	useCallout,
	useSelectedColumn,
} from '../../state/deriveDataVariablesPage.js'
import type { CausalFactor } from '../../types/causality/CausalFactor.js'
import type { Definition } from '../../types/experiments/Definition.js'
import type { Maybe } from '../../types/primitives.js'
import { CommandActionType } from '../../types/workflow/CommandActionType.js'
import {
	useSelectedOptionByColumn,
	useSelectedOptionByColumnAndVariable,
	useSelectedOptions,
} from './useSelectedOption.js'

const buttonStyles = {
	root: {
		width: 190,
	},
	label: {
		width: 150,
		lineHeight: '1.5',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	} as IRawStyle,
}

export function useRenderDropdown(
	allElements: CausalFactor[] | Definition[],
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
		(option: Maybe<IContextualMenuItem>, columnName: string) => {
			const type = option?.data?.type as CommandActionType //eslint-disable-line
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
				onItemClick: (
					_?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
					option?: Maybe<IContextualMenuItem>,
				) => handleOnClick(option, columnName),
			}

			const buttonProps = {
				styles: buttonStyles,
			}

			const variable = `${
				subjectIdentifier === columnName
					? ' Subject identifier'
					: selectedVariableByColumn(columnName)?.variable ?? 'Options'
			}`

			return (
				<Container id={columnName} title={variable}>
					<ColumnarMenu
						text={variable}
						{...menuProps}
						buttonProps={buttonProps}
					/>
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
			items = items.filter(x => !x.data?.button) //eslint-disable-line

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
	return options.find(x => x.data?.type === type) //eslint-disable-line
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
			//eslint-disable-next-line
		} else if (item.data?.button) {
			filtered.push(item)
		}
	})
	return filtered
}

const Container = styled.div``
