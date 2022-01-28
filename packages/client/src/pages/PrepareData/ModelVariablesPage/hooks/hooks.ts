/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ICommandBarItemProps,
	IContextualMenuProps,
	IDetailsColumnProps,
	IDropdownOption,
	IRenderFunction,
} from '@fluentui/react'
import { useBoolean } from 'ahooks'
import { useCallback, useMemo, useState } from 'react'
import { FactorsOrDefinitions } from './types'
import {
	useColumnsAsTarget,
	useDefinitionOptions,
	useSelected,
	useSubjectIdentifier,
	useSubjectIdentifierData,
} from './variables'
import { useAddOrEditFactor, usePageType, useSaveDefinition } from '~hooks'
import {
	useAllModelVariables,
	useAllTableColumns,
	useCausalFactors,
	useDefineQuestion,
	useOriginalTables,
	useProjectFiles,
} from '~state'
import {
	PageType,
	DataTable,
	FilterObject,
	Element,
	CausalFactor,
	VariableDefinition,
} from '~types'
import { createDefaultCommandBar } from '@data-wrangling-components/react'

export function useBusinessLogic(): {
	pageType: PageType
	definitionSelected: string
	columnsMenuProps: IContextualMenuProps
	defineQuestionData: Element
	modelVariables: VariableDefinition[][]
	subjectIdentifier: string[]
	subjectIdentifierData: DataTable
	tableIdentifier: DataTable | undefined
	definitionOptions: FactorsOrDefinitions
	isDeriveVisible: boolean
	editingClause: FilterObject | undefined
	onResetClause: () => void
	onSave: (definition: string) => void
	onToggleDeriveVisible: () => void
	onEditClause: (filter: FilterObject) => void
	onUpdateTargetVariable: ReturnType<typeof useSetTargetVariable>
	onSelectDefinition: (option: any) => void
	definitionDropdown: IDropdownOption[]
	commandBar: IRenderFunction<IDetailsColumnProps>
} {
	const pageType = usePageType()
	const projectFiles = useProjectFiles()

	const causalFactors = useCausalFactors()
	const saveCausalFactor = useAddOrEditFactor()
	const allTableColumns = useAllTableColumns(projectFiles)
	const allOriginalTables = useOriginalTables()
	const modelVariables = useAllModelVariables(projectFiles, pageType)
	const saveDefinition = useSaveDefinition()
	const [isDeriveVisible, { toggle: onToggleDeriveVisible }] = useBoolean(false)

	const defineQuestion = useDefineQuestion()
	const defineQuestionData = defineQuestion[pageType] as Element
	const [editingClause, setEditingClause] = useState<FilterObject>()
	const [tableIdentifier, setTableIdentifier] = useState<DataTable | undefined>(
		allOriginalTables[0],
	)
	const [selectedDefinition, setSelectedDefinition] = useState<string>('')

	const definitionOptions = useDefinitionOptions({
		defineQuestionData,
		type: pageType,
		causalFactors,
	})

	const definitionSelected = useSelected({
		defineQuestionData,
		definitionOptions,
		selectedDefinition,
		type: pageType,
		causalFactors,
	})

	const subjectIdentifier = useSubjectIdentifier({
		allTableColumns,
		modelVariables,
	})

	const subjectIdentifierData = useSubjectIdentifierData({
		allOriginalTables,
		subjectIdentifier,
		setTableIdentifier,
	})

	const onSelectDefinition = useCallback(
		option => setSelectedDefinition(option.variable),
		[setSelectedDefinition],
	)

	const setTargetOnCausalFactor = useTargetOnCausalFactor(
		definitionSelected,
		causalFactors,
		saveCausalFactor,
	)

	const onSave = useCallback(
		(definition: string) => setSelectedDefinition(definition),
		[setSelectedDefinition],
	)

	const onUpdateTargetVariable = useSetTargetVariable(
		definitionSelected,
		saveDefinition,
		pageType,
		defineQuestionData,
		setTargetOnCausalFactor,
	)

	const columnsAsTarget = useColumnsAsTarget({
		subjectIdentifierData,
		causalFactors,
		type: pageType,
		onUpdateTargetVariable,
	})

	const onEditClause = useCallback(
		(filter: FilterObject) => {
			setEditingClause(filter)
			onToggleDeriveVisible()
		},
		[setEditingClause, onToggleDeriveVisible],
	)

	const onResetClause = useCallback(
		() => setEditingClause(undefined),
		[setEditingClause],
	)

	const columnsMenuProps: IContextualMenuProps = {
		items: columnsAsTarget,
		shouldFocusOnMount: true,
	}

	const definitionDropdown = useMemo((): IDropdownOption[] => {
		return definitionOptions.map(x => {
			return {
				key: x.variable,
				text: x.variable,
			} as IDropdownOption
		})
	}, [definitionOptions])

	const commandBar = useCallback((props?: IDetailsColumnProps) => {
		const items: ICommandBarItemProps[] = [
			{
				key: 'assignItem',
				text: 'Assign',
				iconOnly: true,
				checked: props?.columnIndex === 1,
				iconProps: {
					iconName: 'CheckMark',
				},
			},
			{
				key: 'newItem',
				text: 'Hide column',
				disabled: props?.columnIndex == 1,
				iconOnly: true,
				iconProps: { iconName: 'Hide3' },
				toggle: true,
			},
			{
				key: 'duplicateItem',
				text: 'Duplicate',
				iconOnly: true,
				iconProps: { iconName: 'DuplicateRow' },
			},
		]
		return createDefaultCommandBar(items)
	}, [])

	return {
		pageType,
		definitionSelected,
		columnsMenuProps,
		defineQuestionData,
		modelVariables,
		subjectIdentifier,
		subjectIdentifierData,
		tableIdentifier,
		definitionOptions,
		isDeriveVisible,
		editingClause,
		onResetClause,
		onSave,
		onToggleDeriveVisible,
		onEditClause,
		onUpdateTargetVariable,
		onSelectDefinition,
		definitionDropdown,
		commandBar,
	}
}

function useTargetOnCausalFactor(selected, causalFactors, saveCausalFactor) {
	return useCallback(
		(val: any) => {
			const selectedCausal = {
				...causalFactors.find(x => x.variable === selected),
			} as CausalFactor

			if (selectedCausal) {
				selectedCausal.column = val.text
			}

			saveCausalFactor(selectedCausal)
		},
		[selected, causalFactors, saveCausalFactor],
	)
}

function useSetTargetVariable(
	selected: string,
	saveDefinition: (definition: CausalFactor) => void,
	type: PageType,
	defineQuestionData: Element,
	setTargetOnCausalFactor: (val: any) => void,
) {
	return useCallback(
		(_evt: unknown, value: any) => {
			if (type === PageType.Control) {
				return setTargetOnCausalFactor(value)
			}
			const newDefinition = {
				...defineQuestionData?.definition.find(x => x.variable === selected),
			} as CausalFactor

			if (newDefinition) {
				newDefinition.column = value.text
			}

			saveDefinition(newDefinition)
		},
		[
			selected,
			saveDefinition,
			type,
			defineQuestionData?.definition,
			setTargetOnCausalFactor,
		],
	)
}
