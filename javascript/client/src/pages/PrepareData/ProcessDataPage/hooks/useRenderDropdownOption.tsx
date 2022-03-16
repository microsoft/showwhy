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
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

const buttonStyles = {
	root: {
		width: 190,
	},
	label: {
		width: 150,
	},
}

function useSelectedOptions(allElements: FactorsOrDefinitions): string[] {
	return useMemo((): string[] => {
		return allElements
			.filter((x: ElementDefinition | CausalFactor) => x.column)
			.map(x => x.variable)
	}, [allElements])
}

function useSelectedOptionByColumnAndVariable(
	allElements: FactorsOrDefinitions,
): (
	text: string,
	columnName: string,
) => Maybe<ElementDefinition | CausalFactor> {
	return useCallback(
		(text: string, columnName: string) => {
			return allElements.find(
				(x: ElementDefinition | CausalFactor) =>
					x.variable === text && x.column === columnName,
			)
		},
		[allElements],
	)
}

function useSelectedOptionByColumn(
	allElements: FactorsOrDefinitions,
): (columnName: string) => Maybe<ElementDefinition | CausalFactor> {
	return useCallback(
		(columnName: string) => {
			return allElements.find(
				(x: ElementDefinition | CausalFactor) => x.column === columnName,
			)
		},
		[allElements],
	)
}

function useRenderMenuList(
	dropdownOptions: IContextualMenuItem[],
	selectedVariableByColumn: (
		columnName: string,
	) => Maybe<ElementDefinition | CausalFactor>,
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
			const resetButton = dropdownOptions.find(x => x.data?.button)
			const hasVariable = !selectedVariableByColumn(columnName)?.variable
			if (resetButton) {
				resetButton.disabled = hasVariable
				items = items.filter(x => !x.data?.button)
				items.push(resetButton)
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
		[dropdownOptions, selectedVariableByColumn],
	)
}

export function useRenderDropdown(
	allElements: FactorsOrDefinitions,
	onSelect: (option: Maybe<IContextualMenuItem>, columnName: string) => void,
	onResetVariable: (columnName: string) => void,
	dropdownOptions: IContextualMenuItem[],
): (columnName: string) => JSX.Element {
	const selectedOptions = useSelectedOptions(allElements)
	const isSelected = useSelectedOptionByColumnAndVariable(allElements)
	const selectedVariableByColumn = useSelectedOptionByColumn(allElements)
	const renderMenuList = useRenderMenuList(
		dropdownOptions,
		selectedVariableByColumn,
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
				}
			})

			const menuProps = {
				items: filtered,
				disabled: true,
				onRenderMenuList: (menuListProps: Maybe<IContextualMenuListProps>) =>
					renderMenuList(menuListProps as IContextualMenuListProps, columnName),
				onItemClick: (_: any, option: any) =>
					option.data.reset
						? onResetVariable(columnName)
						: onSelect(option, columnName),
				buttonStyles,
			}

			const variable = selectedVariableByColumn(columnName)?.variable || ''
			return (
				<Container title={variable}>
					<ColumnarMenu
						text={filtered.length ? variable : 'No variables to show'}
						{...menuProps}
					/>
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
		],
	)
}

const Container = styled.div``
