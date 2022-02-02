/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IContextualMenuProps } from '@fluentui/react'
import { useBoolean } from 'ahooks'
import { useCallback, useState } from 'react'
import { FactorsOrDefinitions } from './types'
import {
	useColumnsAsTarget,
	useDefinitionOptions,
	useRelationType,
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
	ElementDefinition,
	FilterObject,
	Element,
	CausalFactor,
	VariableDefinition,
	Maybe,
	Handler,
} from '~types'

export function useBusinessLogic(): {
	pageType: PageType
	selected: string
	columnsMenuProps: IContextualMenuProps
	defineQuestionData: Element
	modelVariables: VariableDefinition[][]
	subjectIdentifier: string[]
	subjectIdentifierData: DataTable
	tableIdentifier: Maybe<DataTable>
	definitionOptions: FactorsOrDefinitions
	isDeriveVisible: boolean
	editingClause: Maybe<FilterObject>
	onResetClause: Handler
	onSave: (definition: string) => void
	onToggleDeriveVisible: Handler
	onEditClause: (filter: FilterObject) => void
	onUpdateTargetVariable: ReturnType<typeof useSetTargetVariable>
	onSelectDefinition: (option: any) => void
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
	const defineQuestionData = (defineQuestion as any)[pageType] as Element
	const [editingClause, setEditingClause] = useState<FilterObject>()
	const [tableIdentifier, setTableIdentifier] = useState<Maybe<DataTable>>(
		allOriginalTables[0],
	)
	const [selectedDefinition, setSelectedDefinition] = useState<string>('')

	const relationType = useRelationType(pageType)

	const definitionOptions = useDefinitionOptions({
		defineQuestionData,
		type: pageType,
		causalFactors,
	})

	const selected = useSelected({
		defineQuestionData,
		definitionOptions,
		selectedDefinition,
		type: pageType,
		causalFactors,
	})

	const subjectIdentifier = useSubjectIdentifier({
		allTableColumns,
		relationType,
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
		selected,
		causalFactors,
		saveCausalFactor,
	)

	const onSave = useCallback(
		(definition: string) => setSelectedDefinition(definition),
		[setSelectedDefinition],
	)

	const onUpdateTargetVariable = useSetTargetVariable(
		selected,
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

	return {
		pageType,
		selected,
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
	}
}

function useTargetOnCausalFactor(
	selected: string,
	causalFactors: CausalFactor[],
	saveCausalFactor: (factor: CausalFactor) => void,
): (val: { text: string }) => void {
	return useCallback(
		(val: { text: string }) => {
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
	saveDefinition: (def: CausalFactor) => void,
	type: PageType,
	defineQuestionData: Element,
	setTargetOnCausalFactor: (val: { text: string }) => void,
) {
	return useCallback(
		(_evt: unknown, value: any) => {
			if (type === PageType.Control) {
				return setTargetOnCausalFactor(value)
			}
			const newDefinition = {
				...defineQuestionData?.definition.find(x => x.variable === selected),
			} as ElementDefinition

			if (newDefinition) {
				newDefinition.column = value.text
			}

			saveDefinition(newDefinition as CausalFactor)
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
