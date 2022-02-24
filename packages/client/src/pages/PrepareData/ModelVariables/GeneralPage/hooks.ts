/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 } from 'uuid'
import { usePageType, useRemoveDefinition, useSaveDefinition } from '~hooks'
import { useDefineQuestion } from '~state'
import {
	CausalFactor,
	CausalityLevel,
	DefinitionActions,
	DefinitionArgs,
	Element,
	ElementDefinition,
	Handler,
	Maybe,
	PageType,
	RenameCalloutType,
	VariableAssignedCount,
} from '~types'

export function useBusinessLogic(): {
	pageType: PageType
	defineQuestionData: Element
	definitions: ElementDefinition[]
} {
	const pageType = usePageType()
	const defineQuestion = useDefineQuestion()
	const defineQuestionData = defineQuestion[pageType] //TODO: ??

	const definitions = useMemo((): ElementDefinition[] => {
		return defineQuestionData?.definition || []
	}, [defineQuestionData])

	return {
		pageType,
		defineQuestionData,
		definitions,
	}
}

export function useDefinitions(defineQuestionData: Element): DefinitionArgs {
	const [selectedId, setSelectedId] = useState<string>('')

	const definition = useMemo(() => {
		return defineQuestionData?.definition.find(x => x.id === selectedId)
	}, [selectedId, defineQuestionData])

	const assignedCount = useMemo((): Maybe<VariableAssignedCount> => {
		const total = defineQuestionData?.definition.length
		if (!total) return undefined
		const assigned = defineQuestionData.definition.filter(
			x => x.column?.length,
		).length

		return {
			total,
			assigned,
		}
	}, [defineQuestionData])

	useEffect(() => {
		if (!definition && defineQuestionData) {
			setSelectedId(defineQuestionData?.definition[0]?.id || '')
		}
	}, [definition, selectedId, setSelectedId, defineQuestionData])

	const onSelect = useCallback(
		(id: string) => {
			setSelectedId(id)
		},
		[setSelectedId],
	)

	return {
		definition,
		onSelect,
		assignedCount,
	}
}

export function useDefinitionActions(
	toggleCallout: (type?: RenameCalloutType) => void,
	setSelectedId: (id: string) => void,
	toggleShowConfirmDelete: Handler,
	onDuplicateDefinition: (definitionId: string, newDefinition: string) => void,
	definition?: ElementDefinition | CausalFactor,
	calloutOpen?: RenameCalloutType,
): DefinitionActions {
	const removeDefinition = useRemoveDefinition()

	const onDelete = useCallback(() => {
		definition && removeDefinition(definition)
		toggleShowConfirmDelete()
	}, [definition, removeDefinition, toggleShowConfirmDelete])

	const onSaveCallout = useCallback(
		(name?: string) => {
			const newId = v4()
			const props =
				calloutOpen === RenameCalloutType.New
					? { id: newId, description: '', level: CausalityLevel.Secondary }
					: calloutOpen === RenameCalloutType.Duplicate
					? { ...definition, id: newId, level: CausalityLevel.Secondary }
					: definition

			const newDefinition = {
				...props,
				variable: name,
				column: undefined,
			} as ElementDefinition
			// onSave(newDefinition)

			if (calloutOpen === RenameCalloutType.Duplicate && definition) {
				onDuplicateDefinition(definition.id, newId)
			}
			toggleCallout(undefined)

			setTimeout(() => {
				setSelectedId(newDefinition.id)
			}, 300)
		},
		[calloutOpen, definition, setSelectedId, toggleCallout],
	)

	return {
		onDelete,
		onSaveCallout,
	}
}
